export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceRecord {
    id: string,
    studentId: string,
    date: string //yyyy-mm-dd
    status: AttendanceStatus,
}

