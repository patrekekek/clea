import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { colors, spacing } from "../theme";

type AppHeaderProps = {
  username?: string;
  onLogout?: () => void;
};

export default function AppHeader({
  username = "Teacher",
  onLogout,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      {/* LEFT */}
      <View>
        <Text style={styles.title}>CLEA</Text>

        <Text style={styles.subtitle}>
          Classroom Learning & Evaluation App
        </Text>
      </View>

      {/* RIGHT */}
      <View style={styles.rightContainer}>
        <Text style={styles.loggedInText}>
          Logged in as
        </Text>

        <Text style={styles.username}>
          {username}
        </Text>

        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
        >
          <Text style={styles.logoutText}>
            Log out
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  rightContainer: {
    alignItems: "flex-end",
    gap: spacing.sm,
  },

  loggedInText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  username: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: -4,
  },

  logoutButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  logoutButtonPressed: {
    opacity: 0.7,
  },

  logoutText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
});