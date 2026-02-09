import { createContext, useContext, useEffect, useState } from "react"
import { Score } from "../types/score"
import { loadScores, saveScores } from "../storage/scoresStorage"

type ScoresContextValue = {
  scores: Score[]
  addScore: (score: Score) => void
  updateScore: (score: Score) => void
  deleteScore: (id: string) => void
}

const ScoresContext = createContext<ScoresContextValue | null>(null)

export function ScoresProvider({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<Score[]>([])

  // load once
  useEffect(() => {
    setScores(loadScores())
  }, [])

  // persist on change
  useEffect(() => {
    saveScores(scores)
  }, [scores])

  function addScore(score: Score) {
    setScores(prev => [...prev, score])
  }

  function updateScore(updated: Score) {
    setScores(prev =>
      prev.map(s => (s.id === updated.id ? updated : s))
    )
  }

  function deleteScore(id: string) {
    setScores(prev => prev.filter(s => s.id !== id))
  }

  return (
    <ScoresContext.Provider
      value={{ scores, addScore, updateScore, deleteScore }}
    >
      {children}
    </ScoresContext.Provider>
  )
}

export function useScores() {
  const context = useContext(ScoresContext)
  if (!context) {
    throw new Error("useScores must be used inside ScoresProvider")
  }
  return context
}
