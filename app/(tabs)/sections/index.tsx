import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import {
  loadSections,
  saveSections,
  Section,
} from "../../../storage/sectionStorage";

import { useStudents } from "../../../context/StudentContext";

// components
import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";
import TopTabs from "../../../components/TopTabs";

import { colors } from "../../../theme/colors";

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [newName, setNewName] = useState("");
  const router = useRouter();

  const { students } = useStudents();

  // LOAD
  useEffect(() => {
    init();
  }, []);

  async function init() {
    const stored = await loadSections();

    if (stored.length > 0) {
      setSections(stored);
    } else {
      const defaults: Section[] = [
        { id: crypto.randomUUID(), name: "Section A" },
        { id: crypto.randomUUID(), name: "Section B" },
        { id: crypto.randomUUID(), name: "Section C" },
        { id: crypto.randomUUID(), name: "Section D" },
        { id: crypto.randomUUID(), name: "Section E" },
      ];

      setSections(defaults);
      await saveSections(defaults);
    }
  }

  async function persist(updated: Section[]) {
    setSections(updated);
    await saveSections(updated);
  }

  function addSection() {
    if (!newName.trim()) return;

    const updated = [
      ...sections,
      { id: crypto.randomUUID(), name: newName },
    ];

    persist(updated);
    setNewName("");
  }

  function updateSection(id: string, name: string) {
    const updated = sections.map(s =>
      s.id === id ? { ...s, name } : s
    );
    persist(updated);
  }

  function goToSection(id: string) {
    router.push(`/sections/${id}`);
  }

  // ✅ MEMOIZED grouping + sorting
  const sortedSections = useMemo(() => {
    return sections
      .map(section => {
        const sectionStudents = students
          .filter(s => s.section === section.name) // ⚠️ still name-based
          .sort((a, b) => a.lastName.localeCompare(b.lastName));

        return {
          ...section,
          students: sectionStudents,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sections, students]);

  return (
    <AppContainer>
      <AppHeader />
      <TopTabs />

      <Text style={styles.title}>Sections</Text>

      {/* Add Section */}
      <View style={styles.row}>
        <TextInput
          placeholder="New section"
          value={newName}
          onChangeText={setNewName}
          style={styles.input}
        />

        <Pressable style={styles.addBtn} onPress={addSection}>
          <Text style={{ color: "white", fontSize: 18 }}>+</Text>
        </Pressable>
      </View>

      {/* Sections List */}
      <FlatList
        data={sections.sort((a, b) => a.name.localeCompare(b.name))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => goToSection(item.id)}
          >
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    borderRadius: 8,
  },
  addBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  pending: {
    fontSize: 12,
    color: "orange",
    marginTop: 4,
  },
});