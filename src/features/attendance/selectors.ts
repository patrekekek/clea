import { AttendanceRecord } from "../../types/attendance";

//this function is like a middleware that transforms all records into mapped group Attendance
export function groupAttendanceByStudent(
    records: AttendanceRecord[]
): Map<string, AttendanceRecord[]> {

    const map = new Map<string, AttendanceRecord[]>();

    records.forEach(record => {
        //making sure that if the student does not exist, it will make it
        if(!map.has(record.studentName)) {
            map.set(record.studentName, []);
        }
        map.get(record.studentName)!.push(record);
    })

    return map
}