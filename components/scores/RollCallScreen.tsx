import { TextInput, StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useEffect, useRef } from 'react';

import Card from '../ui/Card';
import { colors, spacing, typography } from '../../theme';


import { Student } from '../../types/student';


type RollCallProps = {
  students: Student[],
  selectedSection: string | null,
  index: number,
  sortedStudents: Student[],
  value: number,
  setValue: (v: number) => void
  onRecord: () => void
}

export default function RollCallScreen({
  students,
  selectedSection,
  index,
  sortedStudents,
  value,
  setValue,
  onRecord
} : RollCallProps) {
  
  const currentStudent = sortedStudents[index];


  //for autofocus so that scores can be recorded without point the cursor
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => clearTimeout(t);
  }, [index]);
  
  
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
          key={index}
          ref={inputRef}
          autoFocus
          placeholder="Enter Score"
          keyboardType="numeric"
          value={value ? String(value) : ""}
          onChangeText={(t) => setValue(Number(t))}
          onSubmitEditing={onRecord}
          returnKeyType='done'
          style={styles.input}
        />

        <Pressable 
          style={styles.recordButton}
          onPress={onRecord}
        >
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