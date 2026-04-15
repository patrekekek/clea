import { useMemo, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
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

  const sections = useMemo(() => {
    return ["all", ...new Set(students.map((s) => s.section))];
  }, [students]);

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

  const maleStudents = useMemo(
    () => sortedStudents.filter((s) => s.sex === "m"),
    [sortedStudents]
  );

  const femaleStudents = useMemo(
    () => sortedStudents.filter((s) => s.sex === "f"),
    [sortedStudents]
  );

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
      <View style={styles.dropdown}>
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
            <View style={styles.row}>
              <Text style={styles.nameHeader}>Name</Text>
              {days.map((day) => (
                <Text key={day} style={styles.dayHeader}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.row}>
              <Text style={styles.emptyHeader} />
              {days.map((day) => (
                <Text key={day} style={styles.weekday}>
                  {getWeekday(day)}
                </Text>
              ))}
            </View>
          </View>

          {/* MALE */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>
              MALE ({maleStudents.length})
            </Text>
            {days.map((day) => (
              <View key={day} style={styles.sectionCell} />
            ))}
          </View>

          {maleStudents.map((student, i) => (
            <View
              key={student.id}
              style={[styles.row, i % 2 ? styles.altRow : styles.whiteRow]}
            >
              <Text style={styles.nameCell}>{student.lastName}</Text>

              {days.map((day) => {
                const date = `${year}-${month}-${String(day).padStart(2, "0")}`;
                const status = attendanceMap[student.id]?.[date];

                return (
                  <View
                    key={day}
                    style={[
                      styles.cell,
                      { backgroundColor: getColor(status) },
                    ]}
                  >
                    <Text style={styles.cellText}>
                      {status?.[0]?.toUpperCase() ?? ""}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}

          {/* FEMALE */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>
              FEMALE ({femaleStudents.length})
            </Text>
            {days.map((day) => (
              <View key={day} style={styles.sectionCell} />
            ))}
          </View>

          {femaleStudents.map((student, i) => (
            <View
              key={student.id}
              style={[styles.row, i % 2 ? styles.altRow : styles.whiteRow]}
            >
              <Text style={styles.nameCell}>{student.lastName}</Text>

              {days.map((day) => {
                const date = `${year}-${month}-${String(day).padStart(2, "0")}`;
                const status = attendanceMap[student.id]?.[date];

                return (
                  <View
                    key={day}
                    style={[
                      styles.cell,
                      { backgroundColor: getColor(status) },
                    ]}
                  >
                    <Text style={styles.cellText}>
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

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    width: 180,
  },

  row: {
    flexDirection: "row",
  },

  nameHeader: {
    width: 120,
    fontWeight: "700",
    backgroundColor: "#f1f5f9",
    padding: 6,
    borderWidth: 0.5,
  },

  dayHeader: {
    width: 32,
    textAlign: "center",
    fontWeight: "700",
    backgroundColor: "#f1f5f9",
    borderWidth: 0.5,
  },

  emptyHeader: {
    width: 120,
    backgroundColor: "#f8fafc",
    borderWidth: 0.5,
  },

  weekday: {
    width: 32,
    textAlign: "center",
    fontSize: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 0.5,
  },

  sectionHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
  },

  sectionText: {
    width: 120,
    padding: 4,
    fontWeight: "700",
    borderWidth: 0.5,
  },

  sectionCell: {
    width: 32,
    borderWidth: 0.5,
    backgroundColor: "#e2e8f0",
  },

  nameCell: {
    width: 120,
    padding: 4,
    borderWidth: 0.5,
  },

  cell: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
  },

  cellText: {
    fontSize: 10,
  },

  altRow: {
    backgroundColor: "#fafafa",
  },

  whiteRow: {
    backgroundColor: "white",
  },
});