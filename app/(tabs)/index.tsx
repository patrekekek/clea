import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from "../../theme";
import { shadows } from "../../theme/shadows";

//components
import AppContainer from "../../components/AppContainer";
import AppHeader from "../../components/AppHeader";

import TopTabs from "../../components/TopTabs"; //might be combined with AppHeader

export default function Dashboard() {
  return (
    <AppContainer>
      <AppHeader />
      <TopTabs />

    
      {/* HEADER */}
      {/* <Text style={[typography.title, { marginBottom: spacing.lg }]}>
        CLEA
      </Text> */}

      {/* BIG CARD */}
      <View style={[bigCard, shadows]}>
        <Text style={typography.subtitle}>Today's Attendance</Text>
        <Text style={bigNumber}>0</Text>
        <Text style={subText}>students present</Text>
      </View>

      {/* STATS */}
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <View style={[smallCard, shadows]}>
          <Text style={label}>Students</Text>
          <Text style={value}>0</Text>
        </View>

        <View style={[smallCard, shadows]}>
          <Text style={label}>Sections</Text>
          <Text style={value}>0</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={{ marginTop: spacing.xl }}>
        <Text style={typography.subtitle}>Quick Actions</Text>

        <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
          <TouchableOpacity style={primaryButton}>
            <Text style={buttonText}>Take Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={secondaryButton}>
            <Text style={{ color: colors.primary }}>Record Scores</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SECTIONS */}
      <View style={{ marginTop: spacing.xl }}>
        <Text style={typography.subtitle}>Sections</Text>

        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
          <View style={[listCard, shadows]}>
            <Text>Section A</Text>
            <Text style={subText}>0 students</Text>
          </View>

          <View style={[listCard, shadows]}>
            <Text>Section B</Text>
            <Text style={subText}>0 students</Text>
          </View>
        </View>
      </View>
    </AppContainer>
  );
}

const bigCard = {
  backgroundColor: colors.surface,
  padding: spacing.xl,
  borderRadius: 16,
  marginBottom: spacing.lg,
};

const smallCard = {
  flex: 1,
  backgroundColor: colors.surface,
  padding: spacing.lg,
  borderRadius: 12,
};

const listCard = {
  backgroundColor: colors.surface,
  padding: spacing.lg,
  borderRadius: 12,
};

const label = {
  color: colors.textSecondary,
  fontSize: 12,
};

const value = {
  fontSize: 20,
  fontWeight: "700",
  marginTop: 4,
} as const;

const bigNumber = {
  fontSize: 32,
  fontWeight: "700",
  marginTop: 8,
} as const;

const subText = {
  color: colors.textSecondary,
  marginTop: 4,
};

const primaryButton = {
  flex: 1,
  backgroundColor: colors.primary,
  padding: spacing.md,
  borderRadius: 10,
  alignItems: "center",
} as const;

const secondaryButton = {
  flex: 1,
  borderWidth: 1,
  borderColor: colors.primary,
  padding: spacing.md,
  borderRadius: 10,
  alignItems: "center",
} as const;

const buttonText = {
  color: "#fff",
  fontWeight: "600",
} as const;