import { View, Text } from "react-native";
import { AttendanceRecord, AttendanceStatus } from "../../types/attendance";

//features
import {
  buildAttendanceSummary,
} from "./summary";

import { colors, spacing, typography } from "../../theme";

import CalendarTable from "../../components/CalendarTable";

type Props = {
  records: AttendanceRecord[];
};
          
export default function AttendanceSummaryView({ records }: Props) {


  const summaries = buildAttendanceSummary(records);

  if (summaries.length === 0) {
    return (
      <Text style={{ color: colors.textSecondary }}>
        No attendance data yet.
      </Text>
    );
  }

  return (
    <View style={{ marginTop: spacing.lg, gap: spacing.md }}>

      <CalendarTable />
    </View>
  );
}

