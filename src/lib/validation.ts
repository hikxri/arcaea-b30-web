import { getPlayPotential, getPlayRating, getPMRating } from "./calc";
import { loadScores } from "./fileActions";
import { type ValidationResult } from "./types";

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
    if (!scores.some((r) => r["title"] === row["title"] && r["diff"] === row["diff"])) {
      // console.log("Unknown (data index)", index);
      result.unknown.add(index);
      result.success = false;
    }
  }

  // check for missing rows
  for (const [index, row] of scores.entries()) {
    if (!data.some((r) => r["title"] === row["title"] && r["diff"] === row["diff"])) {
      // console.log("Missing (score index)", index);
      result.missing.add(index);
      result.success = false;
    }
  }

  // check for duplicate rows (same title and difficulty)
  const duplicateMap = new Map<string, number[]>();
  for (const [index, row] of data.entries()) {
    const key = `${row["title"]}--${row["diff"]}`;

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
    const song = scores.find((r) => r["title"] === row["title"] && r["diff"] === row["diff"]);
    if (!song) continue;
    if (row["level"] !== song["level"]) {
      result.incorrect.push({
        index: index,
        value: "level",
        expected: song["level"],
        actual: row["level"],
      });
      result.success = false;
    }
    if (toNumber(row["cc"]) !== toNumber(song["cc"])) {
      // console.log(row["title"], row["diff"], row["cc"], "--", song["title"], song["diff"], song["cc"]);
      result.incorrect.push({
        index: index,
        value: "cc",
        expected: song["cc"],
        actual: row["cc"],
      });
      result.success = false;
    }
    if (toNumber(row["note"]) !== toNumber(song["note"])) {
      result.incorrect.push({
        index: index,
        value: "note",
        expected: song["note"],
        actual: row["note"],
      });
      result.success = false;
    }
  }

  return result;
}

// fixes the data after validation, modifies the original array
export function fixData(data: Record<string, string>[], fixes: ValidationResult): void {
  const { unknown, missing, duplicate, incorrect } = fixes;

  // fix unknown rows by removing them
  const rowsToRemove = [...unknown];

  // fix incorrect rows
  for (const { index, value, expected } of incorrect) {
    data[index][value] = expected;
  }

  // fix missing rows by appending to the end
  for (const index of missing) {
    data.push(SCORES[index]);
  }

  // fix duplicate rows by removing them
  for (const indexes of duplicate) {
    // get index with the highest score
    const index = indexes.reduce((a, b) => toNumber(data[a]["score"]) > toNumber(data[b]["score"]) ? a : b, indexes[0]);

    // remove all other indexes
    rowsToRemove.push(...indexes.filter((i) => i !== index));
  }

  // remove rows
  rowsToRemove.sort((a, b) => b - a);
  for (const index of rowsToRemove) {
    if (index >= 0 && index < data.length) data.splice(index, 1);
  }

  // sort data by cc
  data.sort((a, b) => toNumber(b["cc"]) - toNumber(a["cc"]));

  // recalculate pmr, pr, pp
  for (const row of data) {
    row["pmr"] = getPMRating(toNumber(row["score"]));
    row["pr"] = getPlayRating(toNumber(row["score"])).toFixed(3);
    row["pp"] = getPlayPotential(toNumber(row["cc"]), toNumber(row["pr"])).toFixed(3);
  }
}

function normalizeRow(row: Record<string, string>): Record<string, string> {
  const title = String(row["title"] ?? "")
    .replace(/^"+|"+$/g, "")
    .replace(/""+/g, '"')
    .replace(/'/g, '"')
    .trim();
  const difficulty = String(row["diff"] ?? "")
    .trim()
    .toUpperCase();
  return { ...row, title: title, diff: difficulty };
}

export function toNumber(str: string): number {
  try {
    return Number(str.replace(/'|,/g, ""));
  } catch {
    console.log(`[toNumber] Failed to convert ${str}`);
    return 0;
  }
}
