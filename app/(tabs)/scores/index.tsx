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
import ScoreTable from "../../../features/scores/ScoreSummaryView"


//components
import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";
import TopTabs from "../../../components/TopTabs";
import ScoreMVP from "../../../components/scores/ScoreMVP"

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

 






  return (
    <AppContainer>
      <AppHeader />
      <TopTabs />

        <Text style={styles.title}>Record Score</Text>

      <ScoreMVP />

        
    </AppContainer>
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