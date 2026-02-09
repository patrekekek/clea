import { ScoresProvider } from "./src/context/ScoresContext";
import Main from "./src/Main";

export default function App() {
  return (
    <ScoresProvider>
      <Main />
    </ScoresProvider>
  )
}
