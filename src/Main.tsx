import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { Score, SummativeNumber } from "./types/score";

import ScoreList from "./ScoreList";
import AttendanceMVP from "./AttendanceMVP";

//context
import { useScores } from "./context/ScoresContext";
import { useAttendance } from "./context/AttendanceContext";

//for table
import { buildScoreRows } from "./features/scores/selectors";
import { countScoresByType } from "./features/scores/summary";
import ScoreTable from "./features/scores/ScoreTable";

//for attendance
import AttendanceSummaryView from "./features/attendance/AttendanceSummaryView";

type ScoreKind = "summative" | "performance" | "quarterly";

export default function Main() {
  const { scores, addScore, updateScore, deleteScore } = useScores();
  const { records } = useAttendance();

  const [studentName, setStudentName] = useState("");
  const [type, setType] = useState<ScoreKind>("summative");
  const [summativeNo, setSummativeNo] = useState<SummativeNumber>(1);
  const [score, setScore] = useState("");

  const rows = buildScoreRows(scores);

  console.log("Rows", buildScoreRows(scores));
  console.log("Summar", countScoresByType(scores));

  function isDuplicate(newScore: Score) {
    return scores.some(s => {
      if (s.studentName !== newScore.studentName) return false
      if (s.type !== newScore.type) return false

      if (s.type === "summative" && newScore.type === "summative") {
        return s.summativeNo === newScore.summativeNo
      }

      return true
    })
  }

  function recordScore() {
    let newScore: Score

    if (type === "summative") {
      newScore = {
        id: crypto.randomUUID(),
        studentName,
        type,
        summativeNo,
        score: Number(score),
      }
    } else {
      newScore = {
        id: crypto.randomUUID(),
        studentName,
        type,
        score: Number(score),
      }
    }

    if (isDuplicate(newScore)) {
      alert("Duplicate score detected for this student.")
      return
    }

    addScore(newScore)

    setStudentName("")
    setScore("")
    setSummativeNo(1)
  }

  return (
    <ScrollView style={{ padding: 24, gap: 8 }}>
      <Text style={{ fontSize: 18 }}>Record Score (MVP)</Text>

      <TextInput
        placeholder="Student name"
        value={studentName}
        onChangeText={setStudentName}
        style={{ borderWidth: 1, padding: 8 }}
      />

      <View style={{ flexDirection: "row", gap: 8 }}>
        {(["summative", "performance", "quarterly"] as ScoreKind[]).map(t => (
          <Pressable
            key={t}
            onPress={() => setType(t)}
            style={{
              padding: 8,
              backgroundColor: type === t ? "#333" : "#ddd",
            }}
          >
            <Text style={{ color: type === t ? "#fff" : "#000" }}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {type === "summative" && (
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[1, 2, 3, 4].map(n => (
            <Pressable
              key={n}
              onPress={() => setSummativeNo(n as SummativeNumber)}
              style={{
                padding: 8,
                backgroundColor: summativeNo === n ? "#333" : "#ddd",
              }}
            >
              <Text style={{ color: summativeNo === n ? "#fff" : "#000" }}>
                S{n}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <TextInput
        placeholder="Score"
        keyboardType="numeric"
        value={score}
        onChangeText={setScore}
        style={{ borderWidth: 1, padding: 8 }}
      />

      <Pressable
        onPress={recordScore}
        style={{ backgroundColor: "#000", padding: 12 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Record
        </Text>
      </Pressable>

      <ScoreList
        scores={scores}
        onUpdate={updateScore}
        onDelete={deleteScore}
      />

      <ScoreTable
        rows={rows}
      />

      <AttendanceMVP/>
      <AttendanceSummaryView records={records} />
    </ScrollView>
  )
}
