import { createContext, useContext, useEffect, useState } from "react";
import { Student } from "../types/student";
import { loadStudents, saveStudents } from "../storage/studentStorage";


type StudentContextValue = {
  students: Student[]
  addStudent: (student: Student) => void
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

type PendingAction = 
  | { type: "ADD", student: Student}

const StudentContext = createContext<StudentContextValue | null>(null);


const API = "http://localhost:5000/api/students/"

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);

  console.log("s", students)

  //local first
  const fetchStudents = async (local: Student[]) => {
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

      const merged = mergeStudents(local, formatted);
      setStudents(merged);

    } catch (error) {
      console.error("Fetch error:", error);
    }
  }


  //merging students from offline to online
  function mergeStudents(local: Student[], remote: Student[]): Student[] {
    
    const map = new Map(local.map( s => [s.id, s]));

    remote.forEach(s => {
      map.set(s.id, s);
    });
    
    return Array.from(map.values());
  }


  //offline-first
  useEffect(() => {
    const local = loadStudents();
    setStudents(local);

    fetchStudents(local);


    // retry local syncing to online
    local
      .filter(s => s.pending)
      .forEach(async (student) => {
        try {
          await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: student.id,
              first_name: student.firstName,
              last_name: student.lastName,
              middle_name: student.middleName,
              section: student.section,
              sex: student.sex,
              status: student.status,
            }),
          });

          setStudents(prev =>
            prev.map(s => 
              s.id === student.id ? {...s , pending: false } : s
            )
          )
        } catch(error) {
          console.log("still offline")
        }
      })
  }, []);

  useEffect(() => {
    saveStudents(students)
  }, [students])


  async function addStudent(student: Student) {
    const newStudent = { ...student, pending: true };

    setStudents(prev => [...prev, newStudent]);

    try {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          id: student.id,
          first_name: student.firstName,
          last_name: student.lastName,
          middle_name: student.middleName,
          section: student.section,
          sex: student.sex,
          status: student.status,
        }),
      });

      // mark as synced
      setStudents(prev =>
        prev.map(s =>
          s.id === student.id ? { ...s, pending: false} : s
        )
      )

    } catch(error) {
      console.log("Saved locally, will sync later")
    }
  }

  return (
    <StudentContext.Provider value={{ students, addStudent }}>
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
