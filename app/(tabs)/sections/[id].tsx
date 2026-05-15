import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import { useEffect, useMemo, useState } from "react";

import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";

import SectionStudentList from "../../../components/sections/SectionStudentList";

import { useStudents } from "../../../context/StudentContext";

import {
  loadSections,
  Section,
} from "../../../storage/sectionStorage";

import { colors } from "../../../theme/colors";

export default function SectionDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { students } = useStudents();

  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSection() {
      try {
        const allSections = await loadSections();

        const foundSection = allSections.find(
          section => section.id === id
        );

        setSection(foundSection || null);
      } catch (error) {
        console.log("Failed to load section", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSection();
  }, [id]);

  const filteredStudents = useMemo(() => {
    if (!section) return [];

    return students
      .filter(
        student => student.section === section.name
      )
      .sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      );
  }, [students, section]);

  return (
    <AppContainer>
      <AppHeader />

      <View style={styles.container}>
        <Text style={styles.title}>
          {section?.name || "Section"}
        </Text>

        {loading ? (
          <Text style={styles.message}>
            Loading...
          </Text>
        ) : (
          <SectionStudentList
            students={filteredStudents}
          />
        )}
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },

  message: {
    textAlign: "center",
    marginTop: 20,
    color: colors.textSecondary,
  },
});