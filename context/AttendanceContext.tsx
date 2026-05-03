import { createContext, useContext, useEffect, useState } from "react";
import { AttendanceRecord } from "../types/attendance";
import { loadAttendance, saveAttendance } from "../storage/attendanceStorage";

type AttendanceContextValue = {
  records: AttendanceRecordWithPending[],
  addRecord: (record: AttendanceRecord) => void,
  updateRecord: (record: AttendanceRecord) => void
}

type AttendanceSupabase = {
  id: string,
  student_id: string,
  date: string,
  status: "present" | "absent" | "late",
  user_id: string, 
}

type AttendanceRecordWithPending = AttendanceRecord & {
  pendingAction: "ADD" | "UPDATE" | "DELETE"
}

type Action =
| { type: "SET_LOCAL", payload: AttendanceRecordWithPending[] }
| { type: "MERGE_REMOTE", payload: AttendanceRecord[] }
| { type: "ADD", payload: AttendanceRecord }
| { type: "UPDATE", payload: AttendanceRecord }
| { type: "DELETE", payload: string }
| { type: "SYNC_SUCCESS", payload: string }



const API = "http://localhost:5000/api/attendance/"



const AttendanceContext = createContext<AttendanceContextValue | null>(null);


//REDUCER
const attendanceReducer = (
  state: AttendanceRecordWithPending[],
  action: Action
): AttendanceRecordWithPending[] => {
  switch (action.type) {

    case "SET_LOCAL":
      return action.payload

    case "MERGE_REMOTE": {
      const map = new Map(state.map(s => [s.id, s]));

      action.payload.forEach(s => {
        const local = map.get(s.id);

        
      })

    }
  }

  return []
}




export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<AttendanceRecordWithPending[]>([]);

  //local first
  const fetchAttendance = async (local: AttendanceRecordWithPending[]) => {
    try {
      const res = await fetch(API);
      const data: AttendanceSupabase[] = await res.json();

      //format to match frontend
      const formatted: AttendanceRecord[] = data.map((a) => ({
        id: a.id,
        studentId: a.student_id,
        date: a.date,
        status: a.status
      }))

      const merged = mergeAttendance(local, formatted);
      setRecords(merged);

    } catch(error) {
      console.error("Fetch error", error);
    }
  }

  //merging attendance both offline and online
  function mergeAttendance(local: AttendanceRecord[], remote: AttendanceRecord[]): AttendanceRecord[] {
    
    const map = new Map(local.map(a => [a.id, a]));

    remote.forEach(a => {
      if (!map.has(a.id)) {
        map.set(a.id, a);
      }
    });

    return(Array.from(map.values()));
  }



  //offline-first
  useEffect(() => {

    const local: AttendanceRecordWithPending[] = loadAttendance();
    setRecords(local);

    fetchAttendance(local);


    //retry local syncing to online
    local
      .filter(a => a.pending)
      .forEach(async (attendance) => {
        try {
          await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
              id: attendance.id,
              student_id: attendance.studentId,
              date: attendance.date,
              status: attendance.status,
            })
          })

          setRecords(prev =>
            prev.map( a =>
              a.id === attendance.id ? { ...a, pending: false } : a
            )
          )

        } catch(error) {
          console.error("Failed to update")
        }
      })

  }, [])

  useEffect(() => {
    saveAttendance(records)
  }, [records])

  function addRecord(record: AttendanceRecord) {
    setRecords(prev => [...prev, { ...record, pending: true }])
  }

  function updateRecord(updated: AttendanceRecord) {
    setRecords(prev =>
      prev.map(r =>
        r.id === updated.id
          ? { ...updated, pending: true } // mark for resync
          : r
      )
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
