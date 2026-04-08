import { useMemo } from "react";
import { ScrollView, View, Text } from "react-native";
import { useStudents } from "../context/StudentContext";
import { useAttendance } from "../context/AttendanceContext";


import { getMonthDays } from "../features/attendance/summary";
import { AttendanceStatus } from "../types/attendance";

export default function CalendarTable() {
    const { students } = useStudents();
    const { records } = useAttendance();

    const days = getMonthDays();
    console.log("days", days)

    const attendanceMap = useMemo(() => {
        const map: Record<string, Record<string, AttendanceStatus>> = {};

        records.forEach( r => {
            if(!map[r.studentId]) map[r.studentId] = {};
            map[r.studentId][r.date] = r.status;
        });

        return map;
    }, [records])

    return (
        <ScrollView horizontal>
      <View>
        
        {/* HEADER */}
        <View style={{ flexDirection: "row" }}>
          <Text style={{ width: 120 }}>Name</Text>

          {days.map(day => (
            <Text
              key={day}
              style={{ width: 32, textAlign: "center" }}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* ROWS */}
        {students.map(student => (
          <View
            key={student.id}
            style={{ flexDirection: "row" }}
          >
            <Text style={{ width: 120 }}>
              {student.firstName}
            </Text>

            {days.map(day => {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, "0");

                const date = `${year}-${month}-${String(day).padStart(2, "0")}`;
                const status = attendanceMap[student.id]?.[date];

              return (
                <Text
                  key={day}
                  style={{
                    width: 32,
                    textAlign: "center",
                  }}
                >
                  {status?.[0]?.toUpperCase() ?? "-"}
                </Text>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
    )
}