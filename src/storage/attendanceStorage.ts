import { AttendanceRecord } from "../types/attendance";

const STORAGE_KEY = "clea_attendance";

export function loadAttendance(): AttendanceRecord[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : []
    } catch (error) {
        return []
    }
}

export function saveAttendance(records: AttendanceRecord[]):void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}