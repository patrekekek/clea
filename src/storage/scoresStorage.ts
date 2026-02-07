import { Score } from "../types/score"

const STORAGE_KEY = "clea_scores"

export function loadScores(): Score[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveScores(scores: Score[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}
