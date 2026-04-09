import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";
import { Student } from "../../types/student"


type ScoreRowProps = {
    student: Student,
    value: string,
    onChange: (text: string) => void
}

export default function ScoreRow({
  student,
  value,
  onChange
}: ScoreRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.name}>
        {student.firstName} {student.lastName}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        style={styles.input}
        placeholder="--"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  name: {
    fontSize: 16,
    color: colors.textPrimary
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 6,
    textAlign: "center"
  }
})