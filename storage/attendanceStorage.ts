import { Attendance } from "../types/attendance";

const STORAGE_KEY = "clea_attendance";

export function loadAttendance(): Attendance[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : []
    } catch (error) {
        return []
    }
}

export function saveAttendance(records: Attendance[]):void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}