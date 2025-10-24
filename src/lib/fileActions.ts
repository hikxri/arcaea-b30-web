import Papa from "papaparse";
import { headersMap } from "./types";

export async function parseCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      transformHeader: (header) => {
        const key = header?.trim().toLowerCase();
        if (key === "") return "";
        return headersMap[key] || header;
      },
      encoding: "utf-8",
      complete: function (results) {
        console.log("Parsed CSV:", results);
        const filtered: Record<string, string>[] = [];

        for (const row of results.data) {
          const filteredRow: Record<string, string> = {};
          for (const [key, value] of Object.entries(row)) {
            if (key && key.trim() !== "" && value !== undefined) {
              filteredRow[key] = value;
            }
          }
          if (Object.keys(filteredRow).length > 0) {
            filtered.push(filteredRow);
          }
        }

        console.log("Filtered CSV:", filtered);
        resolve(filtered);
      },
      error: function (error: Error) {
        reject(error);
      },
    });
  });
}

export async function loadScores(): Promise<Record<string, string>[]> {
  const scoresText = await fetch("scores.csv").then((res) => res.text());

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(scoresText, {
      header: true,
      transformHeader: (header) => headersMap[header.trim().toLowerCase()] || "",
      encoding: "utf-8",
      complete: function (results) {
        // console.log("Parsed CSV:", results);
        resolve(results.data);
      },
      error: function (error: Error) {
        reject(error);
      },
    });
  });
}
