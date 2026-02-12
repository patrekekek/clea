import { AttendanceRecord } from "../../types/attendance"
import { groupAttendanceByStudent } from "./selectors"

export type AttendanceSummary = {
  studentName: string
  absences: number
  lates: number
  presents: number
}

export type AttendanceFlag = 
    | "frequent_absence"
    | "frequent_late"
    | "consecutive_absence"



export function buildAttendanceSummary(
  records: AttendanceRecord[]
): AttendanceSummary[] {
  const grouped = groupAttendanceByStudent(records)

  return Array.from(grouped.entries()).map(([studentName, recs]) => ({
    studentName,
    absences: recs.filter(r => r.status === "absent").length,
    lates: recs.filter(r => r.status === "late").length,
    presents: recs.filter(r => r.status === "present").length,
  }))
}

function sortByDate(records: AttendanceRecord[]) {
    return [...records].sort((a,b) =>
        a.date.localeCompare(b.date)
    )
}


export function hasConsecutiveAbsences(
    records: AttendanceRecord[],
    threshold = 2
): boolean {
    const sorted = sortByDate(records);

    let streak = 0

    for (const r of sorted) {
        if (r.status === "absent") {
            streak++
            if (streak >= threshold) return true
        } else {
            streak = 0
        }
    }
    return false
}


export function flagAttendance(
    records: AttendanceRecord[]
) {
    const grouped = groupAttendanceByStudent(records);
    const flags = new Map<string, AttendanceFlag[]>()

    grouped.forEach((recs, student) => {
        const studentFlags: AttendanceFlag[] = []

        const absences = recs.filter(r => r.status === "absent").length
        const lates = recs.filter(r => r.status === "late").length

        if (absences >= 3) studentFlags.push("frequent_absence")
        if (lates >= 3) studentFlags.push("frequent_late")
        if (hasConsecutiveAbsences(recs, 2)) {
        studentFlags.push("consecutive_absence")
        }

        if (studentFlags.length > 0) {
        flags.set(student, studentFlags)
        }
    })

    return flags
}