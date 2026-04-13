import { View, Text, StyleSheet } from "react-native";
import { useMemo } from "react";

import { useStudents } from "../../context/StudentContext";
import { useScores } from "../../context/ScoresContext";

import { colors, spacing, typography } from "../../theme";
import Card from "../../components/ui/Card";

export default function ScoreSummaryView() {
  const { students } = useStudents();
  const { scores } = useScores();

  const scoreMap = useMemo(() => {
    const map: Record<
      string,
      {
        s1?: number;
        s2?: number;
        s3?: number;
        s4?: number;
        pt?: number;
        q?: number;
      }
    > = {};

    scores.forEach((s) => {
      if (!map[s.studentId]) map[s.studentId] = {};

      if (s.type === "summative") {
        map[s.studentId][`s${s.summativeNo}`] = s.score;
      }

      if (s.type === "performance") {
        map[s.studentId].pt = s.score;
      }

      if (s.type === "quarterly") {
        map[s.studentId].q = s.score;
      }
    });

    return map;
  }, [scores]);

  return (
    <Card>
      {/* HEADER */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.nameHeader]}>NAME</Text>
        <Text style={styles.cell}>S1</Text>
        <Text style={styles.cell}>S2</Text>
        <Text style={styles.cell}>S3</Text>
        <Text style={styles.cell}>S4</Text>
        <Text style={styles.cell}>PT</Text>
        <Text style={styles.cell}>Q</Text>
      </View>

      {/* ROWS */}
      {students.map((student) => {
        const s = scoreMap[student.id] || {};

        return (
          <View key={student.id} style={styles.row}>
            <Text style={[styles.cell, styles.name]}>
              {student.lastName}, {student.firstName}
            </Text>

            <Text style={styles.cell}>{s.s1 ?? "-"}</Text>
            <Text style={styles.cell}>{s.s2 ?? "-"}</Text>
            <Text style={styles.cell}>{s.s3 ?? "-"}</Text>
            <Text style={styles.cell}>{s.s4 ?? "-"}</Text>
            <Text style={styles.cell}>{s.pt ?? "-"}</Text>
            <Text style={styles.cell}>{s.q ?? "-"}</Text>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },

  header: {
    borderBottomWidth: 2,
  },

  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
  },

  name: {
    flex: 2,
    textAlign: "left",
    fontWeight: "600",
  },

  nameHeader: {
    flex: 2,
    textAlign: "left",
    fontWeight: "700",
  },
});