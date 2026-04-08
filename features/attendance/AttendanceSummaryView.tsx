import { View, Text } from "react-native";
import { AttendanceRecord, AttendanceStatus } from "../../types/attendance";
import { useStudents } from "../../context/StudentContext";

//features
import {
  buildAttendanceSummary,
  flagAttendance,
  getMonthDays
} from "./summary";


import Card from "../../components/ui/Card";
import { colors, spacing, typography } from "../../theme";
import { useMemo } from "react";


import CalendarTable from "../../components/CalendarTable";

type Props = {
  records: AttendanceRecord[];
};
          
export default function AttendanceSummaryView({ records }: Props) {
  const { students } = useStudents();

  const summaries = buildAttendanceSummary(records);
  const flags = flagAttendance(records);

  if (summaries.length === 0) {
    return (
      <Text style={{ color: colors.textSecondary }}>
        No attendance data yet.
      </Text>
    );
  }



  const attendanceMap = useMemo(() => {
    const map: Record<string, Record<string, AttendanceStatus>> = {};

    records.forEach(r => {
      if (!map[r.studentId]) map[r.studentId] = {};
      map[r.studentId][r.date] = r.status;
    });

    return map;

  }, [records]);




  return (
    <View style={{ marginTop: spacing.lg, gap: spacing.md }}>

      <CalendarTable />
    </View>
  );
}





      // {summaries.map((summary) => {
      //   const student = students.find(
      //     (s) => s.id === summary.studentId
      //   );

      //   const studentFlags = flags.get(summary.studentId);

      //   return (
      //     <Card key={summary.studentId}>
            
      //       NAME
      //       <Text style={{ fontWeight: "700", fontSize: 16 }}>
      //         {student?.firstName || "Unknown Student"}
      //       </Text>

      //       {/* STATS */}
      //       <Text style={{ marginTop: 4 }}>
      //         Absences: {summary.absences}
      //       </Text>
      //       <Text>Lates: {summary.lates}</Text>

      //       {/* FLAGS */}
      //       {studentFlags && (
      //         <View style={{ marginTop: spacing.sm }}>
      //           {studentFlags.map((flag) => (
      //             <Text
      //               key={flag}
      //               style={{
      //                 color: colors.danger,
      //                 fontWeight: "600",
      //               }}
      //             >
      //               {flag}
      //             </Text>
      //           ))}
      //         </View>
      //       )}

      //     </Card>
      //   );
      // })}