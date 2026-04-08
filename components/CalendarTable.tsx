import { useMemo, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { useStudents } from "../context/StudentContext";
import { useAttendance } from "../context/AttendanceContext";

import { getMonthDays } from "../features/attendance/summary";
import { AttendanceStatus } from "../types/attendance";

export default function CalendarTable() {
  const { students } = useStudents();
  const { records } = useAttendance();

  const [selectedSection, setSelectedSection] = useState("all");

  const days = getMonthDays();

  // unique sections
  const sections = useMemo(() => {
    return ["all", ...new Set(students.map((s) => s.section))];
  }, [students]);

  // filter + sort
  const sortedStudents = useMemo(() => {
    const filtered =
      selectedSection === "all"
        ? students
        : students.filter((s) => s.section === selectedSection);

    return [...filtered].sort((a, b) =>
      `${a.lastName} ${a.firstName}`.localeCompare(
        `${b.lastName} ${b.firstName}`
      )
    );
  }, [students, selectedSection]);

  // split by sex
  const maleStudents = useMemo(
    () => sortedStudents.filter((s) => s.sex === "m"),
    [sortedStudents]
  );

  const femaleStudents = useMemo(
    () => sortedStudents.filter((s) => s.sex === "f"),
    [sortedStudents]
  );

  // attendance lookup
  const attendanceMap = useMemo(() => {
    const map: Record<string, Record<string, AttendanceStatus>> = {};

    records.forEach((r) => {
      if (!map[r.studentId]) map[r.studentId] = {};
      map[r.studentId][r.date] = r.status;
    });

    return map;
  }, [records]);

  const getColor = (status?: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "#22c55e";
      case "late":
        return "#f59e0b";
      case "absent":
        return "#ef4444";
      default:
        return "#f8fafc";
    }
  };

  const now = new Date();
  const year = now.getFullYear();
  const monthIndex = now.getMonth();
  const month = String(monthIndex + 1).padStart(2, "0");

  const getWeekday = (day: number) => {
    const date = new Date(year, monthIndex, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  };

  return (
    <View>
      {/* DROPDOWN */}
      <View
        style={{
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 10,
          overflow: "hidden",
          width: 180,
        }}
      >
        <Picker
          selectedValue={selectedSection}
          onValueChange={(value) => setSelectedSection(value)}
        >
          {sections.map((section) => (
            <Picker.Item
              key={section}
              label={section.toUpperCase()}
              value={section}
            />
          ))}
        </Picker>
      </View>

      <ScrollView horizontal>
        <View>
          {/* HEADER */}
          <View>
            {/* DATE ROW */}
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: 120,
                  fontWeight: "700",
                  backgroundColor: "#f1f5f9",
                  padding: 6,
                  borderWidth: 0.5,
                }}
              >
                Name
              </Text>

              {days.map((day) => (
                <Text
                  key={day}
                  style={{
                    width: 32,
                    textAlign: "center",
                    fontWeight: "700",
                    backgroundColor: "#f1f5f9",
                    borderWidth: 0.5,
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* WEEKDAY ROW */}
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: 120,
                  backgroundColor: "#f8fafc",
                  borderWidth: 0.5,
                }}
              />

              {days.map((day) => (
                <Text
                  key={day}
                  style={{
                    width: 32,
                    textAlign: "center",
                    fontSize: 10,
                    backgroundColor: "#f8fafc",
                    borderWidth: 0.5,
                  }}
                >
                  {getWeekday(day)}
                </Text>
              ))}
            </View>
          </View>

          {/* MALE HEADER */}
          <View style={{ flexDirection: "row", backgroundColor: "#e2e8f0" }}>
            <Text
              style={{
                width: 120,
                padding: 4,
                fontWeight: "700",
                borderWidth: 0.5,
              }}
            >
              MALE ({maleStudents.length})
            </Text>

            {days.map((day) => (
              <View
                key={day}
                style={{
                  width: 32,
                  borderWidth: 0.5,
                  backgroundColor: "#e2e8f0",
                }}
              />
            ))}
          </View>

          {/* MALE ROWS */}
          {maleStudents.map((student, i) => (
            <View
              key={student.id}
              style={{
                flexDirection: "row",
                backgroundColor: i % 2 ? "#fafafa" : "white",
              }}
            >
              <Text
                style={{
                  width: 120,
                  padding: 4,
                  borderWidth: 0.5,
                }}
              >
                {student.firstName}
              </Text>

              {days.map((day) => {
                const date = `${year}-${month}-${String(day).padStart(2, "0")}`;
                const status = attendanceMap[student.id]?.[date];

                return (
                  <View
                    key={day}
                    style={{
                      width: 32,
                      height: 32,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 0.5,
                      backgroundColor: getColor(status),
                    }}
                  >
                    <Text style={{ fontSize: 10 }}>
                      {status?.[0]?.toUpperCase() ?? ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}

          {/* FEMALE HEADER */}
          <View style={{ flexDirection: "row", backgroundColor: "#e2e8f0" }}>
            <Text
              style={{
                width: 120,
                padding: 4,
                fontWeight: "700",
                borderWidth: 0.5,
              }}
            >
              FEMALE ({femaleStudents.length})
            </Text>

            {days.map((day) => (
              <View
                key={day}
                style={{
                  width: 32,
                  borderWidth: 0.5,
                  backgroundColor: "#e2e8f0",
                }}
              />
            ))}
          </View>

          {/* FEMALE ROWS */}
          {femaleStudents.map((student, i) => (
            <View
              key={student.id}
              style={{
                flexDirection: "row",
                backgroundColor: i % 2 ? "#fafafa" : "white",
              }}
            >
              <Text
                style={{
                  width: 120,
                  padding: 4,
                  borderWidth: 0.5,
                }}
              >
                {student.firstName}
              </Text>

              {days.map((day) => {
                const date = `${year}-${month}-${String(day).padStart(2, "0")}`;
                const status = attendanceMap[student.id]?.[date];

                return (
                  <View
                    key={day}
                    style={{
                      width: 32,
                      height: 32,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 0.5,
                      backgroundColor: getColor(status),
                    }}
                  >
                    <Text style={{ fontSize: 10 }}>
                      {status?.[0]?.toUpperCase() ?? ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}