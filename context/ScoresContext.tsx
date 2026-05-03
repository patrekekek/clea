import { createContext, useEffect, useReducer, useState } from "react"
import { Score } from "../types/score"
import { loadScores, saveScores } from "../storage/scoresStorage"


type ScoresContextValue = {
  scores: ScoreWithPending[],
  addScore: (score: Score) => void,
  updateScore: (score: Score) => void,
  deleteScore: (id: string) => void,
}

type ScoreWithPending = Score & {
  pendingAction?: "ADD" | "UPDATE" | "DELETE"
}

type Action = 
| { type: "SET_LOCAL", payload: ScoreWithPending[] }
| { type: "MERGE_REMOTE", payload: Score[] }
| { type: "ADD", payload: Score }
| { type: "UPDATE", payload: Score }
| { type: "DELETE", payload: string }
| { type: "SYNC_SUCCESS", payload: string }



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
        const local = map.get(s.id);

        if (!local) {
          map.set(s.id, s);
        } else if (local.pendingAction === "DELETE") {
          // prevent deleted to appear again
          return;
        }
      });

      return Array.from(map.values());
    }

    case "ADD":
      return [...state, {...action.payload, pendingAction: "ADD"}];

    
    case "UPDATE":
      return state.map(s => {
          if (s.id !== action.payload.id) return s;

          if (s.pendingAction === "DELETE") return s; // don't revive deleted item

          return { ...action.payload, pendingAction: "UPDATE" };
        });
    
    case "DELETE":
      return state.map(s => 
        s.id === action.payload
          ? { ...s, pendingAction: "DELETE"}
          : s
      )
    
    case "SYNC_SUCCESS":
      return state
        .map(s =>
          s.id === action.payload
            ? { ...s, pendingAction: undefined }
            : s
        )
        .filter(s => s.pendingAction !== "DELETE"); //remove after server sends ok
    
    default:
      return state;
    
  };
}


function formatToBackend(score : ScoreWithPending) {
  return {
    id: score.id,
    student_id: score.studentId,
    subject: score.subject,
    type: score.type,
    ...(score.type === "summative" && {
      summative_no: score.summativeNo
    }),
    score: score.score,
  };
}


export function ScoresProvider({ children }: { children: React.ReactNode }) {
  const [scores, dispatch] = useReducer(scoresReducer, []);


  //local first
    const fetchScores = async () => {
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

    fetchScores();

  }, []);


  // sync attempt
  useEffect(() => {
    const pending = scores.filter(s => s.pendingAction);

    if (pending.length === 0)
    
    pending.forEach(async (score) => {

        try {

          if (score.pendingAction === "ADD") {
            await fetch(API, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formatToBackend(score))
            })
          }

          if (score.pendingAction === "UPDATE") {
            await fetch(`${API}/${score.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formatToBackend(score)),
            });
          }

          if (score.pendingAction === "DELETE") {
            await fetch(`${API}/${score.id}`, {
              method: "DELETE",
            })
          }

          dispatch({ type: "SYNC_SUCCESS", payload: score.id})

        } catch (error) {
          console.error("Sync failed:", score.pendingAction, score.id);
        }
      });
  }, [scores]);

  // persist on change and safve on local
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
