import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { AttendanceStatus } from "../types/attendance";
import { useAttendance } from "../context/AttendanceContext";
import { useStudents } from "../context/StudentContext";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { colors, spacing, typography } from "../theme";

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
      .sort((a, b) =>
        `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`
        )
      );
  }, [students, selectedSection]);

  const currentStudent = sortedStudents[index];

  function recordAttendance(status: AttendanceStatus) {
    if (!currentStudent) return;

    const date = today();

    const existing = records.find(
      (r) =>
        r.studentId === currentStudent.id &&
        r.date === date
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
        <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>
          Select Section
        </Text>

        <View style={{ gap: spacing.sm }}>
          {sections.map((section) => (
            <Pressable
              key={section}
              onPress={() => setSelectedSection(section)}
              style={{
                padding: spacing.md,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Text style={{ fontWeight: "600" }}>
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

        <View style={{ marginTop: spacing.md }}>
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
      <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>
        {selectedSection.toUpperCase()}
      </Text>

      {/* student card */}
      <View
        style={{
          padding: spacing.lg,
          borderRadius: 12,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: spacing.lg,
        }}
      >
        <Text style={{ color: colors.textSecondary }}>
          {index + 1} / {sortedStudents.length}
        </Text>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            marginTop: 6,
          }}
        >
          {currentStudent.firstName} {currentStudent.lastName}
        </Text>
      </View>

      {/* buttons */}
      <View style={{ gap: spacing.sm }}>
        {(["present", "late", "absent"] as AttendanceStatus[]).map((s) => (
          <Pressable
            key={s}
            onPress={() => recordAttendance(s)}
            style={{
              padding: spacing.md,
              borderRadius: 10,
              alignItems: "center",
              backgroundColor: colors.primary,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}