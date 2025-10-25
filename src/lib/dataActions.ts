import { inverseHeadersMap } from "./types";
import { toNumber } from "./validation";

export function sortData(data: Record<string, string>[]) {
  const sorted = [...data].sort((a, b) => toNumber(b["pp"]) - toNumber(a["pp"]));
  return sorted;
}

export function getUnknownHeaders(row: Record<string, string>): string[] {
  if (row === undefined) return [];
  const VALID_KEYS = Object.keys(inverseHeadersMap);
  return Object.keys(row).filter((key) => !VALID_KEYS.includes(key.toLowerCase()));
}
