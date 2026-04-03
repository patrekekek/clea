import React from "react";
import { View, Text } from "react-native";
import { colors, spacing, typography } from "../theme";

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>CLEA</Text>
        <Text style={styles.subtitle}>Classroom Learning & Evaluation App</Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  } as const,

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
};