import { TextInput, StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react';

import Card from '../ui/Card';
import { colors, spacing, typography } from '../../theme';


import { Student } from '../../types/student';


type RollCallProps = {
  students: Student[],
  selectedSection: string,
  index: number,
  sortedStudents: Student[],
}

export default function RollCallScreen({students, selectedSection, index, sortedStudents} : RollCallProps) {
  
  const currentStudent = sortedStudents[index];
  
  
  return (
    <Card>
      <Text style={[typography.subtitle, styles.header]}>
        {selectedSection?.toUpperCase()}
      </Text>

      {/* student card */}
      <View style={styles.studentCard}>
        <Text style={{ color: colors.textSecondary}}>
          {index + 1} / {sortedStudents.length}
        </Text>

        <Text style={styles.text}>
          {currentStudent.firstName} {currentStudent.lastName}
        </Text>
      </View>

      {/* entry */}
      <View style={styles.entryRow}>
        <TextInput 
          placeholder="Enter Score"
          keyboardType="numeric"
          style={styles.input}
        />

        <Pressable style={styles.recordButton}>
          <Text style={styles.recordText}>Record</Text>
        </Pressable>


      </View>

    </Card>
  )

}


const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
  },
  studentCard: {
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg
  },
  text: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },
  entryRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  input: {
    flex: 2,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  recordButton: {
    flex: 1, // 1/3 width
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  recordText: {
    color: "white",
    fontWeight: "600",
  }
})