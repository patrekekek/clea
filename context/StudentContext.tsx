import { createContext, useContext, useEffect, useState } from "react";
import { Student } from "../types/student";
import { loadStudents, saveStudents } from "../storage/studentStorage";

type StudentContextValue = {
  students: Student[]
  addStudent: (student: Student) => void
}

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    setStudents(loadStudents())
  }, [])

  useEffect(() => {
    saveStudents(students)
  }, [students])

  function addStudent(student: Student) {
    setStudents(prev => [...prev, student])
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
