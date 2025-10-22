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

export const shortValuesMap = {
  level: "Level",
  cc: "CC",
  note: "Note count",
};

export const valuesMap = {
  level: "Level",
  cc: "Chart Constant",
  note: "Note count",
};

export const headersMap: Record<string, string> = {
  title: "title",
  diff: "diff",
  difficulty: "diff",
  level: "level",
  cc: "cc",
  "chart constant": "cc",
  score: "score",
  note: "note",
  "note count": "note",
  pmr: "pmr",
  "pm rating": "pmr",
  pr: "pr",
  "play rating": "pr",
  pp: "pp",
  "play potential": "pp",
};

export const inverseHeadersMap: Record<string, string> = {
  title: "Title",
  diff: "Difficulty",
  level: "Level",
  cc: "Chart Constant",
  note: "Note Count",
  score: "Score",
  pmr: "PM Rating",
  pr: "Play Rating",
  pp: "Play Potential",
};
