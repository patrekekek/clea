import { useState, useEffect } from "react"
import { View, Text, TextInput, Pressable } from "react-native"
import { Score, SummativeNumber } from "./src/types/score"
import { loadScores, saveScores } from "./src/storage/scoresStorage"

//components
import ScoreList from "./src/ScoreList"

type ScoreKind = "summative" | "performance" | "quarterly"

export default function App() {
  const [scores, setScores] = useState<Score[]>([]);

  const [studentName, setStudentName] = useState("");
  const [type, setType] = useState<ScoreKind>("summative");
  const [summativeNo, setSummativeNo] = useState<SummativeNumber>(1);
  const [score, setScore] = useState("");

  useEffect(() => {
    const saved = loadScores()
    setScores(saved)
    console.log("LOADED SCORES:", saved)
  }, []);

  useEffect(() => {
    saveScores(scores)
  }, [scores]);


  function isDuplicate(newScore: Score, existing: Score[]) {
    return existing.some(s => {
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

    if (isDuplicate(newScore, scores)) {
      alert("Duplicate score detected for this student.")
      return
    }

    setScores(prev => [...prev, newScore])
    console.log("RECORDED SCORES:", [...scores, newScore])

    setStudentName("")
    setScore("")
    setSummativeNo(1)
  }


  function updateScore(updated: Score) {
    setScores(prev =>
      prev.map(s => (s.id === updated.id ? updated : s))
    )
  }

  function deleteScore(id: string) {
    setScores(prev => prev.filter(s => s.id !== id))
  }


  return (
    <View style={{ padding: 24, gap: 8 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>
        Record Score (MVP)
      </Text>

      {/* Student */}
      <TextInput
        placeholder="Student name"
        value={studentName}
        onChangeText={setStudentName}
        style={{ borderWidth: 1, padding: 8 }}
      />

      {/* Type selector */}
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

      {/* Summative number (only if summative) */}
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

      {/* Score */}
      <TextInput
        placeholder="Score"
        keyboardType="numeric"
        value={score}
        onChangeText={setScore}
        style={{ borderWidth: 1, padding: 8 }}
      />

      {/* Record */}
      <Pressable
        onPress={recordScore}
        style={{ backgroundColor: "#000", padding: 12, marginTop: 8 }}
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

    </View>
  )
}
