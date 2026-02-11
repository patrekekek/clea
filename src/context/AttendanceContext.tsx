import { createContext, useContext, useEffect, useState } from "react";
import { AttendanceRecord } from "../types/attendance";
import { loadAttendance, saveAttendance } from "../storage/attendanceStorage";

type AttendanceContextValue = {
  records: AttendanceRecord[],
  addRecord: (record: AttendanceRecord) => void,
  updateRecord: (record: AttendanceRecord) => void
}

const AttendanceContext = createContext<AttendanceContextValue | null>(null);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    setRecords(loadAttendance())
  }, [])

  useEffect(() => {
    saveAttendance(records)
  }, [records])

  function addRecord(record: AttendanceRecord) {
    setRecords(prev => [...prev, record])
  }

  function updateRecord(updated: AttendanceRecord) {
    setRecords(prev =>
      prev.map(r => (r.id === updated.id ? updated : r))
    )
  }

  return (
    <AttendanceContext.Provider value={{ records, addRecord, updateRecord }}>
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
