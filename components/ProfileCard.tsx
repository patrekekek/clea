import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { colors, spacing } from "../theme";

export default function ProfileCard() {
  const [name, setName] = useState("Juan Dela Cruz");
  const [bio, setBio] = useState("");
  const [feeling, setFeeling] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  return (
    <View style={styles.root}>
      
      {/* LEFT: PROFILE */}
      <View style={styles.avatarColumn}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {name.charAt(0)}
            </Text>
          </View>
        )}

        <Text style={styles.name}>{name}</Text>

        <TouchableOpacity style={styles.logout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* RIGHT: FORM */}
      <View style={styles.formColumn}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={bio}
          onChangeText={setBio}
        />

        <Text style={styles.label}>Feeling</Text>
        <TextInput
          style={styles.input}
          value={feeling}
          onChangeText={setFeeling}
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primary}>
            <Text style={styles.primaryText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondary}>
            <Text>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const AVATAR = 100;

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    gap: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 16,
  },

  avatarColumn: {
    width: 160,
    alignItems: "center",
  },

  formColumn: {
    flex: 1,
  },

  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: 14,
  },

  avatarPlaceholder: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarInitial: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },

  name: {
    fontWeight: "700",
    marginTop: spacing.sm,
    color: colors.textPrimary,
  },

  label: {
    marginBottom: 6,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: "#fff",
  },

  textArea: {
    height: 100,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  primary: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 10,
  },

  primaryText: {
    color: "#fff",
    fontWeight: "700",
  },

  secondary: {
    backgroundColor: "#f3f4f6",
    padding: spacing.md,
    borderRadius: 10,
  },

  logout: {
    marginTop: spacing.md,
    backgroundColor: "#E5E7EB",
    padding: spacing.sm,
    borderRadius: 8,
  },

  logoutText: {
    fontWeight: "600",
    color: colors.textSecondary,
  },
});