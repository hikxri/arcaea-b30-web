import { toNumber } from "./validation";

export function sortData(data: Record<string, string>[]) {
  const sorted = [...data].sort((a, b) => toNumber(b["pp"]) - toNumber(a["pp"]));
  return sorted;
}