import { toNumber } from "./validation";

export function getPlayRating(score: number): number {
  if (score >= 10_000_000) return 2.0;
  else if (score >= 9_800_000) return 1 + (score - 9_800_000) / 200_000;
  else return (score - 9_500_000) / 300_000;
}

export function getPlayPotential(cc: number, pr: number): number {
  return Math.max(cc + pr, 0);
}

export function getPMRating(score: number): string {
  if (score >= 10_000_000) return String(score - 10_000_000);
  else return "-";
}

export function getAveragePlayPotential(data: Record<string, string>[]): number {
  return data.reduce((acc, curr) => acc + toNumber(curr["pp"]), 0) / data.length;
}

export function getMaxPlayPotential(data: Record<string, string>[]): number {
  data = [...data.slice(0, 30), ...data.slice(0, 10)];
  return data.reduce((acc, curr) => acc + toNumber(curr["pp"]), 0) / 40;
}