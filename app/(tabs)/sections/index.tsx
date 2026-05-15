import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";
import TopTabs from "../../../components/TopTabs";

import { useStudentContext } from "../../../hooks/useStudentContext";

import { colors } from "../../../theme/colors";

import SectionDropdown from "../../../components/sections/SectionDropdown";
import SectionStudentList from "../../../components/sections/SectionStudentList";

export default function SectionsPage() {
  const { students } = useStudentContext();

  console.log(students)

  const [selectedSection, setSelectedSection] = useState("");

  // get unique sections
  const sections = useMemo(() => {
    return [...new Set(students.map(student => student.section))];
  }, [students]);

  // filter students
  const filteredStudents = useMemo(() => {
    return students.filter(
      student => student.section === selectedSection
    );
  }, [students, selectedSection]);

  return (
    <AppContainer>
      <AppHeader />
      <TopTabs />

      <View style={styles.container}>
        <Text style={styles.title}>Sections</Text>

        <SectionDropdown
          sections={sections}
          selectedSection={selectedSection}
          onSelect={setSelectedSection}
        />

        <SectionStudentList students={filteredStudents} />
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
    marginBottom: 16,
  },
});