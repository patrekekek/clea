import { Stack } from "expo-router";
import { StudentProvider } from "../context/StudentContext";
import { ScoresProvider } from "../context/ScoresContext";
import { AttendanceProvider } from "../context/AttendanceContext";

export default function RootLayout() {
  return (
    <StudentProvider>
      <ScoresProvider>
        <AttendanceProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AttendanceProvider>
      </ScoresProvider>
    </StudentProvider>
  );
}
