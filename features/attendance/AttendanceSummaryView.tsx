import { View, Text } from "react-native";

//features
import {
  buildAttendanceSummary,
} from "./summary";

import { colors, spacing, typography } from "../../theme";

import CalendarTable from "../../components/CalendarTable";
import { useAttendance } from "../../context/AttendanceContext";

          
export default function AttendanceSummaryView() {
  const { records } = useAttendance();
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

