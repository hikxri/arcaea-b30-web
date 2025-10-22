import { loadScores } from "./fileActions";
import type { ValidationResult } from "./types";

export const SCORES = await loadScores();

export function validateData(data: Record<string, string>[]): ValidationResult {
  const scores = structuredClone(SCORES).map(normalizeRow);
  const result: ValidationResult = {
    success: true,
    error: "",
    unknown: new Set(),
    missing: new Set(),
    duplicate: new Set(),
    incorrect: [],
  };

  data = data.map(normalizeRow);

  // ass code
  // check for unknown rows
  for (const [index, row] of data.entries()) {
    if (!scores.some((r) => r["Title"] === row["Title"] && r["Difficulty"] === row["Difficulty"])) {
      // console.log("Unknown (data index)", index);
      result.unknown.add(index);
      result.success = false;
    }
  }

  // check for missing rows
  for (const [index, row] of scores.entries()) {
    if (!data.some((r) => r["Title"] === row["Title"] && r["Difficulty"] === row["Difficulty"])) {
      // console.log("Missing (score index)", index);
      result.missing.add(index);
      result.success = false;
    }
  }

  // check for duplicate rows (same title and difficulty)
  const duplicateMap = new Map<string, number[]>();
  for (const [index, row] of data.entries()) {
    const key = `${row["Title"]}--${row["Difficulty"]}`;

    if (!duplicateMap.has(key)) {
      duplicateMap.set(key, []);
    }

    duplicateMap.get(key)!.push(index);
  }

  for (const indexes of duplicateMap.values()) {
    if (indexes.length > 1) {
      result.duplicate.add(indexes);
      result.success = false;
    }
  }

  // checking for incorrectness
  for (const [index, row] of data.entries()) {
    if (index === 0) continue;
    const song = scores.find((r) => r["Title"] === row["Title"] && r["Difficulty"] === row["Difficulty"]);
    if (!song) continue;
    if (row["Level"] !== song["Level"]) {
      result.incorrect.push({
        index: index,
        value: "level",
        expected: song["Level"],
        actual: row["Level"],
      });
      result.success = false;
    }
    if (toNumber(row["Chart Constant"]) !== toNumber(song["Chart Constant"])) {
      // console.log(row["Title"], row["Difficulty"], row["Chart Constant"], "--", song["Title"], song["Difficulty"], song["Chart Constant"]);
      result.incorrect.push({
        index: index,
        value: "cc",
        expected: song["Chart Constant"],
        actual: row["Chart Constant"],
      });
      result.success = false;
    }
    if (toNumber(row["Note Count"]) !== toNumber(song["Note Count"])) {
      result.incorrect.push({
        index: index,
        value: "note",
        expected: song["Note Count"],
        actual: row["Note Count"],
      });
      result.success = false;
    }
  }

  return result;
}

function normalizeRow(row: Record<string, string>): Record<string, string> {
  const title = String(row["Title"] ?? "")
    .replace(/^"+|"+$/g, "")
    .replace(/""+/g, '"')
    .replace(/'/g, '"')
    .trim();
  const difficulty = String(row["Difficulty"] ?? "")
    .trim()
    .toUpperCase();
  return { ...row, Title: title, Difficulty: difficulty };
}

function toNumber(str: string): number {
  try {
    return Number(str.replace(/'|,/g, ""));
  } catch {
    console.log(str);
    return 0;
  }
}
