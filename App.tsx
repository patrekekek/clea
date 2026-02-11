import { ScoresProvider } from "./src/context/ScoresContext";
import { AttendanceProvider } from "./src/context/AttendanceContext";

import Main from "./src/Main";

export default function App() {
  return (
    <ScoresProvider>
      <AttendanceProvider>
        <Main />
      </AttendanceProvider>
    </ScoresProvider>
  )
}
