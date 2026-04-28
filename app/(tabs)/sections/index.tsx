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

  const [newName, setNewName] = useState("");
  const [selectedSection, setSelectedSection] = useState<String>("");
  const router = useRouter();

  const { students } = useStudents();

  


  const sections: Section[] = [
    { id: crypto.randomUUID(), name: "Apple" },
    { id: crypto.randomUUID(), name: "Banana" },
    { id: crypto.randomUUID(), name: "Cat" },
    { id: crypto.randomUUID(), name: "Dog" },
    { id: crypto.randomUUID(), name: "Eagle" },
  ] 


  const selectedStudent = (selectedSection: String) => {
    return students
      .filter(s => s.section === selectedSection)
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

        <Pressable style={styles.addBtn} onPress={() => {}}>
          <Text style={{ color: "white", fontSize: 18 }}>+</Text>
        </Pressable>
      </View>

      {/* Sections List */}
      <FlatList
        data={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedSection === item.name;
          const sectionStudents = students.filter(
            s => s.section === item.name
          )

          return (
            <View style={{ marginBottom: 12 }}>
              {/*section*/}
              <Pressable
                style={styles.card}
                onPress={() =>
                  setSelectedSection(isSelected ? "" : item.name)
                }
              >
                <Text style={styles.name}>{item.name}</Text>
              </Pressable>

              {/* Students (only show if selected) */}
                {isSelected && (
                  <View style={{ marginLeft: 10 }}>
                    {sectionStudents.length === 0 ? (
                      <Text style={{ color: "gray" }}>
                        No students
                      </Text>
                    ) : (
                      sectionStudents.map(student => (
                        <View key={student.id} style={styles.studentCard}>
                          <Text>
                            {student.lastName}, {student.firstName}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                )}


            </View>
          )
        }}
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
  studentCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
});