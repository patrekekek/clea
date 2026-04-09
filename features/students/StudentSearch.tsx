//for development

import { useMemo } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

import { Student } from "../../types/student";

type StudentSearchProps = {
  students: Student[];
  query: string;
  setQuery: (text: string) => void;
  onSelect: (student: Student) => void;
};

export default function StudentSearch({
  students,
  query,
  setQuery,
  onSelect
}: StudentSearchProps) {
  const results = useMemo(() => {
    if (!query.trim()) return [];

    return students.filter(s =>
      `${s.firstName} ${s.lastName}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query, students]);

  return (
    <View style={{ marginBottom: 10 }}>
      <TextInput
        placeholder="Search student..."
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          padding: 8,
          borderRadius: 8
        }}
      />

      {results.length > 0 && (
        <View
          style={{
            borderWidth: 1,
            borderRadius: 8,
            marginTop: 4,
            backgroundColor: "white"
          }}
        >
          {results.map(student => (
            <Pressable
              key={student.id}
              onPress={() => {
                onSelect(student);
                setQuery("");
              }}
              style={{
                padding: 8,
                borderBottomWidth: 1
              }}
            >
              <Text>
                {student.firstName} {student.lastName}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}