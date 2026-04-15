import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { AttendanceStatus } from "../../types/attendance";
import { useAttendance } from "../../context/AttendanceContext";
import { useStudents } from "../../context/StudentContext";

import Card from "../ui/Card";
import Button from "../ui/Button";
import { colors, spacing, typography } from "../../theme";

const today = () => new Date().toISOString().slice(0, 10);


export default function AttendanceMVP() {
  const { records, addRecord, updateRecord } = useAttendance();
  const { students } = useStudents();

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  // get unique sections
  const sections = useMemo(() => {
    return [...new Set(students.map((s) => s.section))];
  }, [students]);

  // filter students by section
  const sortedStudents = useMemo(() => {
    if (!selectedSection) return [];

    return students
      .filter((s) => s.section === selectedSection)
      .sort((a, b) => {
        // 1. male first
        if (a.sex !== b.sex) {
          return a.sex === "m" ? -1 : 1;
        }

        // 2. then alphabetical
        return `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`
        );
      });

  }, [students, selectedSection]);

  const currentStudent = sortedStudents[index];

  //recordAttendance
  function recordAttendance(status: AttendanceStatus) {
    if (!currentStudent) return;

    const date = today();

    const existing = records.find(
      (r) => r.studentId === currentStudent.id && r.date  === date
    );

    if (existing) {
      updateRecord({ ...existing, status });
    } else {
      addRecord({
        id: crypto.randomUUID(),
        studentId: currentStudent.id,
        date,
        status,
      });
    }

    setIndex((prev) => prev + 1);
  }

  //reset
  function reset() {
    setIndex(0);
    setSelectedSection(null);
  }





  // =========================
  // SECTION SELECT SCREEN
  // =========================
  if (!selectedSection) {
    return (
      <Card>
        <Text style={[typography.subtitle, styles.header]}>
          Select Section
        </Text>

        <View style={{ gap: spacing.sm }}>
          {sections.map((section) => (
            <Pressable
              key={section}
              onPress={() => setSelectedSection(section)}
              style={styles.option}
            >
              <Text style={styles.optionText}>
                {section.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>
    );
  }

  // =========================
  // DONE SCREEN
  // =========================
  if (!currentStudent) {
    return (
      <Card>
        <Text style={typography.subtitle}>
          Attendance Complete ✅
        </Text>

        <View style={styles.header}>
          <Button title="Take Another Section" onPress={reset} />
        </View>
      </Card>
    );
  }

  // =========================
  // ROLL CALL SCREEN
  // =========================
  return (
    <Card>
      <Text style={[typography.subtitle, styles.header]}>
        {selectedSection.toUpperCase()}
      </Text>

      {/* student card */}
      <View
        style={styles.studentCard}
      >
        <Text style={{ color: colors.textSecondary }}>
          {index + 1} / {sortedStudents.length}
        </Text>

        <Text
          style={styles.studentCardText}
        >
          {currentStudent.firstName} {currentStudent.lastName}
        </Text>
      </View>

      {/* buttons */}
      <View 
        style={styles.buttonContainer}
      >
        {(["present", "late", "absent"] as AttendanceStatus[]).map((s) => {
          const bg =
            s === "present"
              ? "green"
              : s === "late"
              ? "orange"
              : "red";

          return (
            <Pressable
              key={s}
              onPress={() => recordAttendance(s)}
              style={[{backgroundColor: bg,}, styles.attendanceButton]}
            >
              <Text
                style={styles.attendanceText}
              >
                {s}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { 
    marginBottom: spacing.md 
  },

  option: {
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  optionText: {
    fontWeight: "600"
  },

  studentCard: {
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },

  studentCardText: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },

  buttonContainer: { 
    flexDirection: "row",
    gap: spacing.sm 
  },

  attendanceButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
  },
  
  attendanceText: {
    color: "white",
    fontWeight: "900",
    textTransform: "capitalize",
  },
  
})