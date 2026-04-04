import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { AttendanceStatus } from "../types/attendance";
import { useAttendance } from "../context/AttendanceContext";

import { useStudents } from "../context/StudentContext";

import {
  buildAttendanceSummary,
  flagAttendance,
} from "../features/attendance/summary";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { colors, spacing, typography } from "../theme";

const today = () => new Date().toISOString().slice(0, 10);

export default function AttendanceMVP() {
  const { records, addRecord, updateRecord } = useAttendance();

  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState<AttendanceStatus>("present");

  //temp sol
  const { students } = useStudents();

  const summaries = buildAttendanceSummary(records);
  const flags = flagAttendance(records);

  console.log("Attendance Summary:", summaries);
  console.log("Attendance Flags", flags);


  function recordAttendance() {
    const date = today();

    const existing = records.find(
      (r) => r.studentId === studentId && r.date === date
    );

    if (existing) {
      updateRecord({ ...existing, status });
      return;
    }

    addRecord({
      id: crypto.randomUUID(),
      studentId,
      date,
      status,
    });

    setStudentId("");
  }

  return (
    <Card>
      {/* TITLE */}
      <Text style={[typography.subtitle, { marginBottom: spacing.md }]}>
        Attendance
      </Text>

      {/* INPUT */}
        <View style={{ gap: spacing.sm }}>
          {students.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setStudentId(s.id)}
              style={{
                padding: spacing.sm,
                borderRadius: 8,
                borderWidth: 1,
                borderColor:
                  studentId === s.id ? colors.primary : colors.border,
                backgroundColor:
                  studentId === s.id ? colors.primary + "20" : colors.surface,
              }}
            >
              <Text>{s.firstName} {s.lastName}</Text>
            </Pressable>
          ))}
        </View>

      {/* STATUS SELECT */}
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        {(["present", "late", "absent"] as AttendanceStatus[]).map((s) => {
          const isActive = status === s;

          return (
            <Pressable
              key={s}
              onPress={() => setStatus(s)}
              style={{
                flex: 1,
                padding: spacing.sm,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: isActive
                  ? colors.primary
                  : colors.surface,
                borderWidth: 1,
                borderColor: isActive
                  ? colors.primary
                  : colors.border,
              }}
            >
              <Text
                style={{
                  color: isActive ? "#fff" : colors.textPrimary,
                  fontWeight: "600",
                }}
              >
                {s}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* BUTTON */}
      <View style={{ marginTop: spacing.md }}>
        <Button title="Record Attendance" onPress={recordAttendance} />
      </View>
    </Card>
  );
}