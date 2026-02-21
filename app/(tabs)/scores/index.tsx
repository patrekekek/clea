import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native"

import { useStudents } from "../../../context/StudentContext"
import { useScores } from "../../../context/ScoresContext"
import { Score, SummativeNumber } from "../../../types/score"
import { Student } from "../../../types/student"

import { colors } from "../../../theme/colors"
import { buildScoreRows } from "../../../features/scores/selectors"
import ScoreTable from "../../../features/scores/ScoreTable"

type ScoreKind = "summative" | "performance" | "quarterly"

export default function ScoresPage() {
  const { students } = useStudents()
  const { scores, addScore } = useScores()

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [type, setType] = useState<ScoreKind>("summative")
  const [summativeNo, setSummativeNo] = useState<SummativeNumber>(1)
  const [score, setScore] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const subjects = [
    "Filipino",
    "English",
    "Math",
    "Science",
    "Araling Panlipunan",
    "Values Education",
    "TLE",
    "MAPEH",
  ]

  const filteredScores = selectedSubject
    ? scores.filter(s => s.subject === selectedSubject)
    : []

  const rows = buildScoreRows(filteredScores)

  function isDuplicate(newScore: Score) {
    return scores.some(s => {
      if (s.studentId !== newScore.studentId) return false
      if (s.subject !== newScore.subject) return false
      if (s.type !== newScore.type) return false

      if (s.type === "summative" && newScore.type === "summative") {
        return s.summativeNo === newScore.summativeNo
      }

      return true
    })
  }

  function recordScore() {
    if (!selectedStudent || !subject || !score ) return;

    let newScore: Score;

    if (type === "summative") {
      newScore = {
        id: crypto.randomUUID(),
        studentId: selectedStudent, //need to change to name here
        subject,
        type: "summative",
        summativeNo,
        score: Number(score)
      }
    } else {
      newScore = {
        id: crypto.randomUUID(),
        studentId: selectedStudent,
        subject,
        type,
        score: Number(score)
      }
    }

    if (isDuplicate(newScore)) {
      alert("Duplicate score detected");
      return;
    }

    addScore(newScore);
    setScore("");
    setSummativeNo(1)

  }

  function getFullName(student: Student | string) {
    if (typeof student === "string") {
      const found = students.find(s => s.id === student)
      if (!found) return ""
      return `${found.firstName} ${found.lastName}`
    }
    return `${student.firstName} ${student.lastName}`
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Record Score</Text>

      <View style={styles.card}>
        {/* Student Dropdown */}
        <TouchableOpacity
          onPress={() => setIsOpen(prev => !prev)}
          style={styles.input}
        >
          <Text>
            {selectedStudent
              ? getFullName(selectedStudent)
              : "Select Student"}
          </Text>
        </TouchableOpacity>

        {isOpen && (
          <View>
            {students.map(student => (
              <TouchableOpacity
                key={student.id}
                onPress={() => {
                  setSelectedStudent(student.id)
                  setIsOpen(false)
                }}
              >
                <Text>{getFullName(student)}</Text>
                <Text>{student.section}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Subject */}
        <TextInput
          placeholder="Subject"
          placeholderTextColor={colors.textSecondary}
          value={subject}
          onChangeText={setSubject}
          style={styles.input}
        />

        {/* Type Selector */}
        <View style={styles.row}>
          {(["summative", "performance", "quarterly"] as ScoreKind[]).map(t => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[
                styles.selectorButton,
                type === t && styles.selectorActive,
              ]}
            >
              <Text
                style={[
                  styles.selectorText,
                  type === t && styles.selectorTextActive,
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Summative Number */}
        {type === "summative" && (
          <View style={styles.row}>
            {[1, 2, 3, 4].map(n => (
              <Pressable
                key={n}
                onPress={() => setSummativeNo(n as SummativeNumber)}
                style={[
                  styles.selectorButton,
                  summativeNo === n && styles.selectorActive,
                ]}
              >
                <Text
                  style={[
                    styles.selectorText,
                    summativeNo === n && styles.selectorTextActive,
                  ]}
                >
                  S{n}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Score Input */}
        <TextInput
          placeholder="Score"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={score}
          onChangeText={setScore}
          style={styles.input}
        />

        <Pressable style={styles.primaryButton} onPress={recordScore}>
          <Text style={styles.primaryButtonText}>Record</Text>
        </Pressable>
      </View>

      {/* Subject Selector */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Subject</Text>
        <View style={styles.rowWrap}>
          {subjects.map(sub => (
            <Pressable
              key={sub}
              onPress={() => setSelectedSubject(sub)}
              style={[
                styles.selectorButton,
                selectedSubject === sub && styles.selectorActive,
              ]}
            >
              <Text
                style={[
                  styles.selectorText,
                  selectedSubject === sub && styles.selectorTextActive,
                ]}
              >
                {sub}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {selectedSubject && (
        <View style={styles.card}>
          <ScoreTable rows={rows} />
        </View>
      )}
    </ScrollView>
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
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  rowWrap: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primarySoft,
    borderRadius: 8,
  },
  selectorActive: {
    backgroundColor: colors.primary,
  },
  selectorText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  selectorTextActive: {
    color: "white",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
})