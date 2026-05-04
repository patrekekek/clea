import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Attendance } from "../types/attendance";
import { loadAttendance, saveAttendance } from "../storage/attendanceStorage";

type AttendanceContextValue = {
  attendance: AttendanceWithPending[],
  addAttendance: (attendance: Attendance) => void,
  updateAttendance: (attendance: Attendance) => void,
  deleteAttendance: (id: string) => void,
}

type AttendanceSupabase = {
  id: string,
  student_id: string,
  date: string,
  status: "present" | "absent" | "late",
  user_id: string, 
}

type AttendanceWithPending = Attendance & {
  pendingAction?: "ADD" | "UPDATE" | "DELETE"
}

type Action =
| { type: "SET_LOCAL", payload: AttendanceWithPending[] }
| { type: "MERGE_REMOTE", payload: Attendance[] }
| { type: "ADD", payload: Attendance }
| { type: "UPDATE", payload: Attendance }
| { type: "DELETE", payload: string }
| { type: "SYNC_SUCCESS", payload: string }



const API = "http://localhost:5000/api/attendance/"



const AttendanceContext = createContext<AttendanceContextValue | null>(null);


//REDUCER
const attendanceReducer = (
  state: AttendanceWithPending[],
  action: Action
): AttendanceWithPending[] => {
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


function formatToBackend(attendance: AttendanceWithPending) {
  return {
    id: attendance.id,
    student_id: attendance.studentId ,
    date: attendance.date ?? new Date().toISOString(),
    status: attendance.status,
  }
}



export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [attendance, dispatch] = useReducer(attendanceReducer, []);


  //local first
  const fetchAttendance = async () => {
    try {
      const res = await fetch(API);
      const data: AttendanceSupabase[] = await res.json();

      //format to match frontend
      const formatted: Attendance[] = data.map((a) => ({
        id: a.id,
        studentId: a.student_id,
        date: a.date,
        status: a.status
      }))

      dispatch({ type: "MERGE_REMOTE", payload: formatted });

    } catch(error) {
      console.error("Fetch error", error);
    }
  }



  //offline-first
  useEffect(() => {

    const local: AttendanceWithPending[] = loadAttendance();
    dispatch({ type: "SET_LOCAL", payload: local });

    fetchAttendance();

  }, [])

  //sync attempt
  useEffect(() => {
    const sync = async () => {
      const pending = attendance.filter(a => a.pendingAction);
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
}, [attendance]);




  useEffect(() => {
    saveAttendance(attendance)
  }, [attendance])




  function addAttendance(attendance: Attendance) {
    dispatch({ type: "ADD", payload: attendance })
  }

  function updateAttendance(attendance: Attendance) {
    dispatch({ type: "UPDATE", payload: attendance});
  }

  function deleteAttendance(id: string) {
    dispatch({ type: "DELETE", payload: id });
  }




  return (
    <AttendanceContext.Provider 
      value={{ attendance, addAttendance, updateAttendance, deleteAttendance }}
    >
      {children}
    </AttendanceContext.Provider>
  )
}

export function useAttendance() {
  const context = useContext(AttendanceContext)
  if (!context) {
    throw new Error("useAttendance must be used inside AttendanceProvider")
  }
  return context
}
