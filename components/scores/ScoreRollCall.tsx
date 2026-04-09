import { useState } from "react"
import { View, ScrollView, Pressable, Text } from "react-native"

import { useStudents } from "../../context/StudentContext"
import { useScores } from "../../context/ScoresContext"

import ScoreRow from "./ScoreRow"

type ScoreRollCallProps = {
  subject: string
  type: string
  summativeNo?: number
}

export default function ScoreRollCall({
  subject,
  type,
  summativeNo
}: ScoreRollCallProps) {

  const { students } = useStudents()
  const { addScore } = useScores()

  const [values, setValues] = useState<Record<string, string>>({})

  function update(studentId: string, value: string) {
    setValues(prev => ({
      ...prev,
      [studentId]: value
    }))
  }

  function submitAll() {
    Object.entries(values).forEach(([studentId, score]) => {
      if (!score) return

      addScore({
        id: crypto.randomUUID(),
        studentId,
        subject,
        type,
        summativeNo,
        score: Number(score)
      })
    })
  }

  return (
    <View>
      <ScrollView>
        {students.map(student => (
          <ScoreRow
            key={student.id}
            student={student}
            value={values[student.id] ?? ""}
            onChange={(v: string) => update(student.id, v)}
          />
        ))}
      </ScrollView>

      <Pressable onPress={submitAll}>
        <Text>Save All</Text>
      </Pressable>
    </View>
  )
}