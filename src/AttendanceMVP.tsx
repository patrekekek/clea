import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { AttendanceStatus } from "./types/attendance";
import { useAttendance } from "./context/AttendanceContext";

import { buildAttendanceSummary, flagAttendance } from "./features/attendance/summary";

const today = () => new Date().toISOString().slice(0, 10);

export default function AttendanceMVP() {
  const { records, addRecord, updateRecord } = useAttendance();

  const [studentName, setStudentName] = useState("");
  const [status, setStatus] = useState<AttendanceStatus>("present");

  //for testing attendance features
  const summaries = buildAttendanceSummary(records);
  const flags = flagAttendance(records)

  console.log("Attendance Summary:", summaries);
  console.log("Attendance Flags", flags)
  
  function recordAttendance() {
    const date = today();

    const existing = records.find(
      r => r.studentName === studentName && r.date === date
    )

    if (existing) {
      updateRecord({ ...existing, status })
      return
    }

    addRecord({
      id: crypto.randomUUID(),
      studentName,
      date,
      status,
    })

    setStudentName("")
  }

  return (
    <View style={{ marginTop: 32, gap: 8 }}>
      <Text style={{ fontSize: 18 }}>Attendance (MVP)</Text>

      <TextInput
        placeholder="Student name"
        value={studentName}
        onChangeText={setStudentName}
        style={{ borderWidth: 1, padding: 8 }}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["present", "late", "absent"] as AttendanceStatus[]).map(s => (
          <Pressable
            key={s}
            onPress={() => setStatus(s)}
            style={{
              padding: 8,
              backgroundColor: status === s ? "#333" : "#ddd",
            }}
          >
            <Text style={{ color: status === s ? "#fff" : "#000" }}>
              {s}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={recordAttendance}
        style={{ backgroundColor: "#000", padding: 12 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Record Attendance
        </Text>
      </Pressable>
    </View>
  )
}
