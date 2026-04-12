import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';

//components
import Card from "../ui/Card";
import RollCallScreen from './RollCallScreen';

//context
import { useStudents } from '../../context/StudentContext';

import { colors, spacing } from "../../theme"
import Button from '../ui/Button';




export default function ScoreRollCall() {
  const { students } = useStudents();
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [index, setIndex] = useState(0);

  const tests = ["Summative 1", "Summative 2", "Summative 3", "Summative 4", "Performance", "Quarterly"]


  console.log(selectedSection, selectedTest);
  console.log("isRecording", isRecording);

  // filter students by section
  const sortedStudents = useMemo(() => {
    if (!selectedSection) return [];

    return students
      .filter((s) => s.section === selectedSection)
      .sort((a, b) => {
        // 1. male first
        if (a.sex !== b.sex) {
          return a.sex === "m" ? -1 : 1;
        }

        // 2. then alphabetical
        return `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`
        );
      });

  }, [students, selectedSection]);

  console.log("sortedStudents", sortedStudents)



  const startRecording = () => {
    if(!selectedSection || !selectedTest) {
      window.alert("Please complete all details");
      return;
    }
    setIsRecording(true);
  }


  //get unique sections //will be replaced by teacher soon
  const sections = useMemo(() => {
    return [...new Set(students.map((s) => s.section))]
  }, [students]);

  if (isRecording === false) {
    return (
      <Card>

        {/* Section Selection */}
        <View style={styles.container}>
          <View style = {styles.column}>
            <Text style={styles.header}>Section</Text>

            {sections.map((section) => (
              <Pressable
                key={section}
                onPress={() => setSelectedSection(section)}
                style={[
                  styles.option,
                  selectedSection === section && styles.selected
                ]}
              >
                <Text style={styles.optionText}>
                  {section.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Test Type Selection */}
          <View style={styles.column}>
            <Text style={styles.header}>Test Type</Text>
            <View>
              {tests.map((test) => (
                <Pressable
                  key={test}
                  onPress={() => setSelectedTest(test)}
                  style={[
                    styles.option,
                    selectedTest === test && styles.selected
                  ]}
                >
                  <Text style={styles.optionText}>
                    {test.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>



        {/* Button */}   
        <View style={{ alignItems: 'center'}}>
            <Button 
              title="Start Recording"
              onPress={startRecording}
              variant="primary"
              style={{
                flex: 1,
                padding: spacing.md,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                height: 70,
              }}
            />
        </View>

      </Card>
    )
  }

  // =========================
  // ROLL CALL SCREEN
  // =========================

  if (isRecording === true) {
    return (
      <RollCallScreen
        students={students}
        selectedSection={selectedSection}
        index={index}
        sortedStudents={sortedStudents}
      />
    )
  }




}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    alignContent: "space-between",
    padding: 20,
  },
  header: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.6,
    marginBottom: 6,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionText: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  selected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  }
})