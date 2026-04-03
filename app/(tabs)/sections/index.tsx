import { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native"
import { useRouter } from "expo-router"

import {
  loadSections,
  saveSections,
  Section,
} from "../../../storage/sectionStorage";


//components
import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";
import TopTabs from "../../../components/TopTabs";

import { colors } from "../../../theme/colors"

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [newName, setNewName] = useState("")
  const router = useRouter()

  // LOAD
  useEffect(() => {
    init()
  }, [])

  async function init() {
    const stored = await loadSections()

    if (stored.length > 0) {
      setSections(stored)
    } else {
      // default 5 sections
      const defaults: Section[] = [
        { id: crypto.randomUUID(), name: "Section A" },
        { id: crypto.randomUUID(), name: "Section B" },
        { id: crypto.randomUUID(), name: "Section C" },
        { id: crypto.randomUUID(), name: "Section D" },
        { id: crypto.randomUUID(), name: "Section E" },
      ]

      setSections(defaults)
      await saveSections(defaults)
    }
  }

  async function persist(updated: Section[]) {
    setSections(updated)
    await saveSections(updated)
  }

  function addSection() {
    if (!newName.trim()) return

    const updated = [
      ...sections,
      { id: crypto.randomUUID(), name: newName },
    ]

    persist(updated)
    setNewName("")
  }

  function updateSection(id: string, name: string) {
    const updated = sections.map(s =>
      s.id === id ? { ...s, name } : s
    )
    persist(updated)
  }

  function goToSection(id: string) {
    router.push(`/sections/${id}`)
  }

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

      {/* List */}
      <FlatList
        data={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => goToSection(item.id)}
          >
            <TextInput
              value={item.name}
              onChangeText={text => updateSection(item.id, text)}
              style={styles.name}
            />
          </Pressable>
        )}
      />
    </AppContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
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
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
})