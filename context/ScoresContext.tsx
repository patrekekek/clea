import { createContext, useContext, useEffect, useReducer, useState } from "react"
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

type Action = 
| { type: "SET_LOCAL", payload: ScoreWithPending[] }
| { type: "MERGE_REMOTE", payload: Score[] }
| { type: "ADD", payload: Score }
| { type: "UPDATE", payload: Score }
| { type: "DELETE", payload: string }
| { type: "SYNC_SUCCESS", payload: string }


type PendingAction = 
| { type: "ADD", score: Score}

const API = "http://localhost:5000/api/scores/"


export const ScoresContext = createContext<ScoresContextValue | null>(null);


//REDUCER
const scoresReducer = (
  state: ScoreWithPending[],
  action: Action
): ScoreWithPending[] => {
  switch (action.type) {

    case "SET_LOCAL":
      return action.payload;
    
    case "MERGE_REMOTE": {
      const map = new Map(state.map(s => [s.id, s]));

      action.payload.forEach(s => {
        if (!map.has(s.id)) {
          map.set(s.id, s)
        }
      });

      return Array.from(map.values());
    };

    case "ADD":
      return [...state, {...action.payload, pending: true}];

    
    case "UPDATE":
      return state.map(s =>
        s.id === action.payload.id
          ? { ...action.payload, pending: true }
          : s
      );
    
    case "DELETE":
      return state.filter(s => s.id !== action.payload);
    
    case "SYNC_SUCCESS":
      return state.map(s =>
        s.id === action.payload ? { ...s, pending: false } : s
      )
    
    default:
      return state;
    
  };
}


export function ScoresProvider({ children }: { children: React.ReactNode }) {
  const [scores, dispatch] = useReducer(scoresReducer, []);


  //local first
    const fetchScores = async (local: ScoreWithPending[]) => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const formatted: Score[] = data.map((s: any) => {
        if (s.type === "summative") {
          return {
            id: s.id,
            studentId: s.student_id,
            subject: s.subject,
            type: "summative",
            summativeNo: (s.summative_no ?? 1) as 1 | 2 | 3 | 4,
            score: s.score,
          };
        }

        if (s.type === "performance") {
          return {
            id: s.id,
            studentId: s.student_id,
            subject: s.subject,
            type: "performance",
            score: s.score,
          };
        }

        return {
          id: s.id,
          studentId: s.student_id,
          subject: s.subject,
          type: "quarterly",
          score: s.score,
        };
      });

      dispatch({ type: "MERGE_REMOTE", payload: formatted });

    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


  //offline-first
  useEffect(() => {
    
    const local: ScoreWithPending[] = loadScores();
    dispatch({ type: "SET_LOCAL", payload: local });

    fetchScores(local);

  }, []);


  // sync attempt
  useEffect(() => {
    scores
      .filter(s => s.pending)
      .forEach(async (score) => {
        try {
          await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: score.id,
              student_id: score.studentId,
              subject: score.subject,
              type: score.type,
              ...(score.type === "summative" && {
                summative_no: score.summativeNo
              }),
              score: score.score,
            }),
          });

          dispatch({ type: "SYNC_SUCCESS", payload: score.id });

        } catch (error) {
          console.error("Sync failed");
        }
      });
  }, [scores]);

  // persist on change
  useEffect(() => {
    saveScores(scores)
  }, [scores])

  function addScore(score: Score) {
    dispatch({ type: "ADD", payload: score});
  }

  function updateScore(score: Score) {
    dispatch({ type: "UPDATE", payload: score});
  }

  function deleteScore(id: string) {
    dispatch({ type: "DELETE", payload: id });
  }

  return (
    <ScoresContext.Provider
      value={{ scores, addScore, updateScore, deleteScore }}
    >
      {children}
    </ScoresContext.Provider>
  )
}
