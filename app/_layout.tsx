import { Stack } from "expo-router";
import { StudentProvider } from "../context/StudentContext";
import { ScoresProvider } from "../context/ScoresContext";
import { AttendanceProvider } from "../context/AttendanceContext";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StudentProvider>
        <ScoresProvider>
          <AttendanceProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </AttendanceProvider>
        </ScoresProvider>
      </StudentProvider>
    </AuthProvider>
  );
}
