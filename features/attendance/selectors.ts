import { AttendanceRecord } from "../../types/attendance";

//this function is like a middleware that transforms all records into mapped group Attendance
export function groupAttendanceByStudent(
  records: AttendanceRecord[]
) {
  const map = new Map<string, AttendanceRecord[]>()

  records.forEach((r) => {
    if (!map.has(r.studentId)) {
      map.set(r.studentId, [])
    }
    map.get(r.studentId)!.push(r)
  })

  return map
}