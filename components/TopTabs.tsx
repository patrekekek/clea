import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { colors, spacing } from "../theme";

export default function TopTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Home", route: "/" },
    { label: "Attendance", route: "/attendance" },
    { label: "Scores", route: "/scores" },
    { label: "Sections", route: "/sections" },
    { label: "Profile", route: "/profile" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = pathname === tab.route;

        return (
          <Pressable
            key={tab.route}
            onPress={() => router.push(tab.route)}
            style={[
              styles.tab,
              active && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.label,
                active && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = {
  container: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  } as const,

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  activeTab: {
    backgroundColor: colors.primary + "15", // subtle highlight
  },

  label: {
    color: colors.textSecondary,
    fontWeight: "600",
  } as const,

  activeLabel: {
    color: colors.primary,
  },
};