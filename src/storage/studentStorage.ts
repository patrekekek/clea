import { Student } from "../types/student";

const STORAGE_KEY = "clea_students";

export function loadStudents(): Student[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : []
    } catch (error) {
        return []
    }
}

export function saveStudents(students: Student[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}