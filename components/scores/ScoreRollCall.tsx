import { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useStudents } from "../../context/StudentContext";
import { useScores } from "../../context/ScoresContext";
import { Student } from "../../types/student";

type ScoreRollCallProps = {
  section: string,
  subject: string,
  type: "summative" | "performance" | "quarterly",
  summativeNo?: 1 | 2 | 3 | 4
};

export default function ScoreRollCall({
  section,
  type
}: ScoreRollCallProps) {
  const { students } = useStudents();
  const { addScore } = useScores();

  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<string>("");

  const sectionStudents = useMemo<Student[]>(() => {
    return students
      .filter(s => s.section === section)
      .sort((a, b) =>
        `${a.lastName} ${a.firstName}`
          .localeCompare(`${b.lastName} ${b.firstName}`)
      );
  }, [students, section]);

  const student = sectionStudents[index];

  function record() {
    if (!student || !score) return;

    const base = {
      id: crypto.randomUUID(),
      studentId: student.id,
      subject: "math", // or pass as prop
      score: Number(score)
    };

    if (type === "summative") {
      addScore({
        ...base,
        type: "summative",
        summativeNo: 1 // must pass this as prop
      });
    }

    if (type === "performance") {
      addScore({
        ...base,
        type: "performance"
      });
    }

    if (type === "quarterly") {
      addScore({
        ...base,
        type: "quarterly"
      });
    }

    setScore("");
    setIndex(i => i + 1);
  }

  if (!student) {
    return <Text>Done</Text>;
  }

  return (
    <View>
      <Text>{section.toUpperCase()}</Text>
      <Text>{type}</Text>

      <View
        style={{
          borderWidth: 1,
          padding: 20
        }}
      >
        <Text>
          {index + 1} / {sectionStudents.length}
        </Text>

        <Text>
          {student.firstName} {student.lastName}
        </Text>
      </View>

      <TextInput
        value={score}
        onChangeText={(text: string) => setScore(text)}
        keyboardType="numeric"
        placeholder="Score"
        style={{
          borderWidth: 1,
          padding: 10
        }}
      />

      <Pressable
        onPress={record}
        style={{
          borderWidth: 1,
          padding: 12,
          alignItems: "center"
        }}
      >
        <Text>Record</Text>
      </Pressable>
    </View>
  );
}