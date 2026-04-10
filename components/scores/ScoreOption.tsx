import { useState, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useStudents } from "../../context/StudentContext";

type ScoreOptionProps = {
  onStart: (section: string, type: string) => void;
};

export default function ScoreOption({ onStart }: ScoreOptionProps) {
  const { students } = useStudents();

  const [section, setSection] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const sections = useMemo<string[]>(
    () => [...new Set(students.map(s => s.section))],
    [students]
  );

  const tests: string[] = [
    "Summative 1",
    "Summative 2",
    "Summative 3",
    "Summative 4",
    "Performance Task",
    "Quarterly Exam"
  ];

  function handleStart() {
    if (!section || !type) return;
    onStart(section, type);
  }

  return (
    <View style={{ gap: 20 }}>
      <Text>Select Section</Text>

      {sections.map((s) => (
        <Pressable
          key={s}
          onPress={() => setSection(s)}
          style={{
            padding: 10,
            borderWidth: 1,
            backgroundColor:
              section === s ? "#dbeafe" : "white"
          }}
        >
          <Text>{s.toUpperCase()}</Text>
        </Pressable>
      ))}

      <Text>Type of Test</Text>

      {tests.map((t) => (
        <Pressable
          key={t}
          onPress={() => setType(t)}
          style={{
            padding: 10,
            borderWidth: 1,
            backgroundColor:
              type === t ? "#dbeafe" : "white"
          }}
        >
          <Text>{t}</Text>
        </Pressable>
      ))}

      <Pressable
        disabled={!section || !type}
        onPress={handleStart}
        style={{
          padding: 14,
          borderWidth: 1,
          alignItems: "center"
        }}
      >
        <Text>Start Recording</Text>
      </Pressable>
    </View>
  );
}