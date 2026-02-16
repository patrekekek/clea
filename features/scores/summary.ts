import { Score } from "../../types/score";

export function countScoresByType (scores: Score[]) {
    return {
        summative: scores.filter(score => score.type === "summative").length,
        performance: scores.filter(score => score.type === "performance").length,
        quarterly: scores.filter(score => score.type === "quarterly").length,
    }
}

export function studentsWithNoQuarterly(scores: Score[]) {
    const students = new Set(scores.map( score => score.studentName));
    
    const withQuarterly = new Set(
        scores.filter(score => score.type === "quarterly").map(score => score.studentName)
    );

    return [...students].filter(score => !withQuarterly.has(score));
}