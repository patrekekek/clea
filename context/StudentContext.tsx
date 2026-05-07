import { createContext, useContext, useEffect, useReducer } from "react";
import { Student } from "../types/student";
import { loadStudents, saveStudents } from "../storage/studentStorage";


type StudentContextValue = {
  students: StudentWithPending[]
  addStudent: (student: Student) => void
  updateStudent: (student: Student) => void,
  deleteStudent: (id: string) => void
}

//

type StudentSupabase = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  section: string;
  sex: "m" | "f";
  status: string;
}

type StudentWithPending = Student & {
  pendingAction?: "ADD" | "UPDATE" | "DELETE"
}

type Action =
| { type: "SET_LOCAL", payload: StudentWithPending[] }
| { type: "MERGE_REMOTE", payload: Student[] }
| { type: "ADD", payload: Student }
| { type: "UPDATE", payload: Student }
| { type: "DELETE", payload: string }
| { type: "SYNC_SUCCESS", payload: string }


const API = "http://localhost:5000/api/students/";



const StudentContext = createContext<StudentContextValue | null>(null);


//REDUCER
const studentReducer = (
  state: StudentWithPending[],
  action: Action
): StudentWithPending[] => {
  switch (action.type) {

    case "SET_LOCAL":
      return action.payload

    case "MERGE_REMOTE": {
      const map = new Map(state.map(s => [s.id, s]));

      action.payload.forEach(s => {
        const local = map.get(s.id);

        if (!local) {
          map.set(s.id, s);

        } else if (local.pendingAction === "DELETE") {
          return;

        } else if (!local.pendingAction) {
          // update clean local records from remote
          map.set(s.id, s);
        }
      });

      return Array.from(map.values());
    }

    case "ADD":
      return [...state, {...action.payload, pendingAction: "ADD"}];
    
    case "UPDATE":
      return state.map(s => {
        if (s.id !== action.payload.id) return s;

        if (s.pendingAction === "DELETE") return s;

        return { ...action.payload, pendingAction: "UPDATE" };
      });

    case "DELETE":
      return state.map(s =>
        s.id === action.payload
          ? { ...s, pendingAction: "DELETE"}
          : s
      )
    
    case "SYNC_SUCCESS":
      return state
        .map(s =>
          s.id === action.payload
            ? { ...s, pendingAction: undefined }
            : s
        )
        .filter(s => s.pendingAction !== "DELETE");
    
    default:
      return state;

  }
}


function formatToBackend(student: StudentWithPending) {
  return {
    id: student.id,
    first_name: student.firstName,
    last_name: student.lastName,
    middle_name: student.middleName,
    section: student.section,
    sex: student.sex,
    status: student.status,
  }
}





export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students, dispatch] = useReducer(studentReducer, []);



  //local first
  const fetchStudents = async () => {
    try {
      const res = await fetch(API);
      const data: StudentSupabase[] = await res.json();

      //format to match frontend
      const formatted: Student[] = data.map((s) => ({
        id: s.id,
        firstName: s.first_name,
        lastName: s.last_name,
        middleName: s.middle_name,
        section: s.section,
        sex: s.sex,
        status: s.status,
      }))

      dispatch({ type: "MERGE_REMOTE", payload: formatted });

    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  //offline first
  useEffect(() => {

    const local: StudentWithPending[] = loadStudents();
    dispatch({ type: "SET_LOCAL", payload: local});

    fetchStudents();

  }, []);


  //sync attempt
  useEffect(() => {
    const sync = async () => {
      const pending = students.filter(s => s.pendingAction);
      if (pending.length === 0) return;

      for (const item of pending) {
        try {
          if (item.pendingAction === "ADD") {
            await fetch(API, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formatToBackend(item)),
            });
          }

          if (item.pendingAction === "UPDATE") {
            await fetch(`${API}/${item.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formatToBackend(item)),
            });
          }

          if (item.pendingAction === "DELETE") {
            await fetch(`${API}/${item.id}`, {
              method: "DELETE",
            });
          }

          dispatch({ type: "SYNC_SUCCESS", payload: item.id });

        } catch (error) {
          console.error("Sync failed", item.pendingAction, item.id);
        }
      }
    };

    sync();
  }, [students]);


  useEffect(() => {
    saveStudents(students)
  }, [students])


  function addStudent(student: Student) {
    dispatch({ type: "ADD", payload: student })
  }

  function updateStudent(student: Student) {
    dispatch({ type: "UPDATE", payload: student})
  }

  function deleteStudent(id: string) {
    dispatch({ type: "DELETE", payload: id })
  }



  return (
    <StudentContext.Provider value={{ students, addStudent, updateStudent, deleteStudent }}>
      {children}
    </StudentContext.Provider>
  )
}

export function useStudents() {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error("useStudents must be used inside StudentProvider")
  }
  return context
}
