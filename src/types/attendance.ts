export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
    id: string,
    studentName: string,
    date: string //yyyy-mm-dd
    status: AttendanceStatus,
}

