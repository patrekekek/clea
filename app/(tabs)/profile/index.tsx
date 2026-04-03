import { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import { loadTeacher, saveTeacher, TeacherProfile } from "../../../storage/teacherStorage";
import { colors } from "../../../theme/colors";

//components
import AppContainer from "../../../components/AppContainer";
import AppHeader from "../../../components/AppHeader";
import TopTabs from "../../../components/TopTabs";

export default function ProfilePage() {
  const [profile, setProfile] = useState<TeacherProfile>({
    name: "",
    subject: "",
    school: "",
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    init()
  }, [])

  async function init() {
    const data = await loadTeacher()
    if (data) setProfile(data)
    setLoading(false)
  }

  async function handleSave() {
    await saveTeacher(profile)
    alert("Saved!")
  }

  if (loading) {
    return <Text style={{ padding: 20 }}>Loading...</Text>
  }

  return (
    <AppContainer>
      <AppHeader />
      <TopTabs />

      <Text style={styles.title}>Teacher Profile</Text>

      <TextInput
        placeholder="Name"
        value={profile.name}
        onChangeText={text => setProfile({ ...profile, name: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Subject"
        value={profile.subject}
        onChangeText={text => setProfile({ ...profile, subject: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="School"
        value={profile.school}
        onChangeText={text => setProfile({ ...profile, school: text })}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={{ color: "white" }}>Save</Text>
      </Pressable>
  </AppContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
})