import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useAttendance } from "../../../context/AttendanceContext";
import { useStudents } from "../../../context/StudentContext";

import AttendanceMVP from "../../../components/attendance/AttendanceMVP";
import AttendanceSummaryView from "../../../features/attendance/AttendanceSummaryView";


//components
import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";
import TopTabs from "../../../components/TopTabs";

import { colors } from "../../../theme/colors";

export default function AttendancePage() {
  const { records } = useAttendance();
  const { students } = useStudents();

  return (
    <AppContainer>
      <AppHeader />
      <TopTabs />

      <Text style={styles.title}>Attendance</Text>

      {/* Record Attendance Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Record Attendance</Text>
        <AttendanceMVP />
      </View>

      {/* Summary Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Attendance Summary</Text>
        <AttendanceSummaryView
          records={records}
        />
      </View>
    </AppContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
})