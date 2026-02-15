import { StudentProvider } from "./src/context/StudentContext";
import { ScoresProvider } from "./src/context/ScoresContext";
import { AttendanceProvider } from "./src/context/AttendanceContext";

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
