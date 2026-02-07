export type SummativeNumber = 1 | 2 | 3 | 4

export type Score =
  | {
      id: string
      studentName: string
      type: "summative"
      summativeNo: SummativeNumber
      score: number
    }
  | {
      id: string
      studentName: string
      type: "performance"
      score: number
    }
  | {
      id: string
      studentName: string
      type: "quarterly"
      score: number
    }
