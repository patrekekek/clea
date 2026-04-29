import { createContext, useContext, useEffect, useState } from "react"
import { Score } from "../types/score"
import { loadScores, saveScores } from "../storage/scoresStorage"

type ScoresContextValue = {
  scores: ScoreWithPending[]
  addScore: (score: Score) => void
  updateScore: (score: Score) => void
  deleteScore: (id: string) => void
}

type ScoresSupabase = {
  id: string,
  student_id: string,
  subject: string,
  type:  "summative" | "performance" | "quarterly",
  summative_no?: number,
  score: number,
}

type ScoreWithPending = Score & {
  pending?: boolean
}

type PendingAction = 
| { type: "ADD", score: Score}

const API = "http://localhost:5000/api/scores/"


const ScoresContext = createContext<ScoresContextValue | null>(null);


export function ScoresProvider({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<ScoreWithPending[]>([])

  //local first
  const fetchScores = async (local: Score[]) => {
    try {
      const res = await fetch(API);
      const data: ScoresSupabase[] = await res.json();

      //format to match frontend
      const formatted: Score[] = data.map((s) => {
        if (s.type === "summative") {
          return {
            id: s.id,
            studentId: s.student_id,
            subject: s.subject,
            type: "summative",
            summativeNo: (s.summative_no ?? 1) as 1 | 2 | 3 | 4,
            score: s.score,
          }
        }

        if (s.type === "performance") {
          return {
            id: s.id,
            studentId: s.student_id,
            subject: s.subject,
            type: "performance",
            score: s.score,
          }
        }

        if (s.type === "quarterly") {
          return {
            id: s.id,
            studentId: s.student_id,
            subject: s.subject,
            type: "quarterly",
            score: s.score,
          }
        }

        throw new Error(`Invalid type: ${s.type}`);
      })

        const merged = mergeScores(local, formatted);
        setScores(merged)

    } catch(error) {
      console.error("Fetch error:", error);
    }
  }

  //mergin scores both offline and online
  function mergeScores(local: Score[], remote: Score[]): Score[] {

    const map = new Map(local.map(s => [s.id, s]));

    remote.forEach(s => {
      if (!map.has(s.id)) {
        map.set(s.id, s);
      }
    });

    return Array.from(map.values());
  }



  //offline-first
  useEffect(() => {
    
    const local: ScoreWithPending[] = loadScores();
    setScores(local);

    fetchScores(local);


    //retry local syncing to online
    local
      .filter(s => s.pending)
      .forEach(async (score) => {
        try {
          await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
              id: score.id,
              student_id: score.studentId,
              subject: score.subject,
              type: score.type,
              ...(score.type === "summative" && {
                summative_no: score.summativeNo
              }),
              score: score.score,
            })
          })

          setScores(prev =>
            prev.map(s => 
              s.id === score.id ? { ...s, pending: false } : s
            )
          )
        } catch(error) {
          console.error("Failed to fetch")
        }
      })




  }, [])

  // persist on change
  useEffect(() => {
    saveScores(scores)
  }, [scores])

  function addScore(score: Score) {
    setScores(prev => [...prev, {...score, pending: true}])
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
