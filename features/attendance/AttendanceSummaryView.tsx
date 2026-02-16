import { View, Text } from 'react-native';
import { AttendanceRecord } from '../../types/attendance';

import { buildAttendanceSummary, flagAttendance } from './summary';


type Props = {
    records: AttendanceRecord[]
}

export default function AttendanceSummaryView({ records }: Props) {
  const summaries = buildAttendanceSummary(records);
  const flags = flagAttendance(records);

  if (summaries.length === 0) {
    return <Text>No attendance data yet.</Text>
  }

  return (
    <View style={{ marginTop: 24, gap: 12 }}>
      <Text style={{ fontSize: 18 }}>Attendance Summary</Text>

      {summaries.map(summary => {
        const studentFlags = flags.get(summary.studentName)

        return (
          <View
            key={summary.studentName}
            style={{ borderWidth: 1, padding: 8, gap: 4 }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {summary.studentName}
            </Text>

            <Text>Absences: {summary.absences}</Text>
            <Text>Lates: {summary.lates}</Text>

            {studentFlags && (
              <View style={{ marginTop: 6 }}>
                {studentFlags.map(flag => (
                  <Text key={flag} style={{ color: "red" }}>
                    {flag}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}