//make tables easy to make

import { Score } from '../../types/score';

export type ScoreRow = {
    studentName: string,
    summative: Partial<Record<1 |2 |3 |4, number >>,
    performance?: number,
    quarterly?: number
}


//consolidates all scores of students for row preparation
export function buildScoreRows(scores: Score[]): ScoreRow[] {
    const map = new Map<string, ScoreRow>();

    scores.forEach(score => {
        //making sure the student exists
        if (!map.has(score.studentName)) {
            map.set(score.studentName, {
                studentName: score.studentName,
                summative: {},
            })
        }

        const row = map.get(score.studentName)!

        if (score.type === "summative") {
            row.summative[score.summativeNo] = score.score;
        }

        if (score.type === "performance") {
            row.performance = score.score;
        }

        if (score.type === "quarterly") {
            row.quarterly = score.score
        }
    });

    return Array.from(map.values());

}
