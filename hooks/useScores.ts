import { useContext } from "react";
import { ScoresContext } from "../context/ScoresContext"


export function useScores() {
  const context = useContext(ScoresContext);
  if (!context) throw new Error("useScores must be used inside ScoresProvider");
  return context;
}
