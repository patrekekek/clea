import { StudentProvider } from "./context/StudentContext";
import { ScoresProvider } from "./context/ScoresContext";
import { AttendanceProvider } from "./context/AttendanceContext";

import Main from "./src/Main";

export default function App() {
  return (
    <StudentProvider>
      <ScoresProvider>
        <AttendanceProvider>
          <Main />
        </AttendanceProvider>
      </ScoresProvider>
    </StudentProvider>
  )
}
