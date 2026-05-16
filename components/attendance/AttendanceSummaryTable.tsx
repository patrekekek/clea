import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useAttendance } from "../../context/AttendanceContext";
import { useStudents } from "../../context/StudentContext";

import { colors } from "../../theme/colors";

type AttendanceStatus = "present" | "late" | "absent";

const statusColorMap: Record<AttendanceStatus, string> = {
  present: "#22c55e",
  late: "#f59e0b",
  absent: "#ef4444",
};

const statusShortMap: Record<AttendanceStatus, string> = {
  present: "P",
  late: "L",
  absent: "A",
};

export default function AttendanceSummaryTable() {
  const { attendance } = useAttendance();
  const { students } = useStudents();

  if (attendance.length === 0) {
    return (
      <Text style={{ color: colors.textSecondary }}>
        No attendance data yet.
      </Text>
    );
  }

  // =========================
  // UNIQUE DATES
  // =========================
  const dates = [
    ...new Set(attendance.map((a) => a.date)),
  ].sort();

  // =========================
  // SORT STUDENTS
  // =========================
  const sortedStudents = [...students].sort((a, b) => {
    if (a.section !== b.section) {
      return a.section.localeCompare(b.section);
    }

    return `${a.lastName} ${a.firstName}`.localeCompare(
      `${b.lastName} ${b.firstName}`
    );
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* HEADER */}
        <View style={styles.row}>
          <View style={[styles.cell, styles.nameCell]}>
            <Text style={styles.headerText}>Student</Text>
          </View>

          {dates.map((date) => (
            <View key={date} style={styles.cell}>
              <Text style={styles.headerText}>
                {date.slice(5)}
              </Text>
            </View>
          ))}
        </View>

        {/* STUDENTS */}
        {sortedStudents.map((student) => {
          return (
            <View key={student.id} style={styles.row}>
              {/* NAME */}
              <View
                style={[styles.cell, styles.nameCell]}
              >
                <Text style={styles.studentName}>
                  {student.lastName},{" "}
                  {student.firstName}
                </Text>

                <Text style={styles.sectionText}>
                  {student.section}
                </Text>
              </View>

              {/* ATTENDANCE */}
              {dates.map((date) => {
                const record = attendance.find(
                  (a) =>
                    a.studentId === student.id &&
                    a.date === date
                );

                const status =
                  record?.status as AttendanceStatus;

                return (
                  <View
                    key={date}
                    style={[
                      styles.cell,
                      {
                        backgroundColor: status
                          ? statusColorMap[status]
                          : colors.surface,
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {status
                        ? statusShortMap[status]
                        : "-"}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },

  cell: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  nameCell: {
    width: 180,
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },

  headerText: {
    fontWeight: "700",
    color: colors.textPrimary,
  },

  studentName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  sectionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  statusText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
});