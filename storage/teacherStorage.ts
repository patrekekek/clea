import AsyncStorage from "@react-native-async-storage/async-storage"

const KEY = "teacher_profile"

export type TeacherProfile = {
  name: string
  subject: string
  school: string
}

export async function loadTeacher(): Promise<TeacherProfile | null> {
  const data = await AsyncStorage.getItem(KEY)
  return data ? JSON.parse(data) : null
}

export async function saveTeacher(profile: TeacherProfile) {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile))
}