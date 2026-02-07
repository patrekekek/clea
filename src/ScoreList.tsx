import { useState } from "react"
import { View, Text, TextInput, Pressable } from "react-native"
import { Score, SummativeNumber } from "./types/score"

type Props = {
  scores: Score[]
  onUpdate: (updated: Score) => void
  onDelete: (id: string) => void
}

export default function ScoreList({ scores, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempScore, setTempScore] = useState("")

  if (scores.length === 0) {
    return <Text>No scores recorded yet.</Text>
  }

  return (
    <View style={{ marginTop: 16, gap: 12 }}>
      {scores.map(score => {
        const isEditing = editingId === score.id

        return (
          <View
            key={score.id}
            style={{ borderWidth: 1, padding: 8, gap: 6 }}
          >
            {isEditing ? (
              <>
                <TextInput
                  value={score.studentName}
                  onChangeText={name =>
                    onUpdate({ ...score, studentName: name })
                  }
                  style={{ borderWidth: 1, padding: 6 }}
                />

                {score.type === "summative" && (
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    {[1, 2, 3, 4].map(n => (
                      <Pressable
                        key={n}
                        onPress={() =>
                          onUpdate({
                            ...score,
                            summativeNo: n as SummativeNumber,
                          })
                        }
                        style={{
                          padding: 6,
                          backgroundColor:
                            score.summativeNo === n ? "#333" : "#ddd",
                        }}
                      >
                        <Text
                          style={{
                            color:
                              score.summativeNo === n ? "#fff" : "#000",
                          }}
                        >
                          S{n}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                <TextInput
                  value={String(score.score)}
                  keyboardType="numeric"
                  onChangeText={val =>
                    onUpdate({ ...score, score: Number(val) })
                  }
                  style={{ borderWidth: 1, padding: 6 }}
                />

                <Pressable
                  onPress={() => setEditingId(null)}
                  style={{ backgroundColor: "#000", padding: 8 }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Done
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text>Student: {score.studentName}</Text>
                <Text>Type: {score.type}</Text>

                {score.type === "summative" && (
                  <Text>Summative: {score.summativeNo}</Text>
                )}

                <Text>Score: {score.score}</Text>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={() => {
                      setEditingId(score.id)
                      setTempScore(String(score.score))
                    }}
                    style={{ backgroundColor: "#ccc", padding: 6 }}
                  >
                    <Text>Edit</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => onDelete(score.id)}
                    style={{ backgroundColor: "#e33", padding: 6 }}
                  >
                    <Text style={{ color: "#fff" }}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )
      })}
    </View>
  )
}
