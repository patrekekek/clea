import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useStudents } from "../../../context/StudentContext";
import { loadSections } from "../../../storage/sectionStorage";

import { useEffect, useState } from "react";
import { Section } from "../../../storage/sectionStorage";

import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";

import { colors } from "../../../theme/colors";

export default function SectionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { students } = useStudents();

  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    async function load() {
      const all = await loadSections();
      const found = all.find(s => s.id === id);
      setSection(found || null);
    }

    load();
  }, [id]);

  // 🔥 filter students for this section
  const filteredStudents = students
    .filter(s => s.section === section?.name)
    .sort((a, b) => a.lastName.localeCompare(b.lastName));

  return (
    <AppContainer>
      <AppHeader />

      <Text style={styles.title}>
        {section?.name || "Section"}
      </Text>

      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.lastName}, {item.firstName}
            </Text>

            {item.pending && (
              <Text style={styles.pending}>Not synced</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No students in this section
          </Text>
        }
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
  pending: {
    fontSize: 12,
    color: "orange",
    marginTop: 4,
  },
});