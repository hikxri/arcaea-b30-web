export type Difficulty = "PST" | "PRS" | "FTR" | "ETR" | "BYD";

export interface ValidationResult {
  success: boolean;
  error: string;
  unknown: Set<number>; // Indexes of songs that are not in SCORES
  missing: Set<number>; // Indexes of songs that are in SCORES, but missing from data
  duplicate: Set<number[]>; // Indexes of songs that are duplicates
  incorrect: IncorrectRow[];
}

export interface IncorrectRow {
  index: number;
  value: "level" | "cc" | "note"; // only checks for song info
  expected: string;
  actual: string;
}
