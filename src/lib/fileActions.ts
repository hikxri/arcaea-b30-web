import Papa from "papaparse";

export async function parseCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      transformHeader: (header) => header.trim(),
      encoding: "utf-8",
      complete: function (results) {
        console.log("Parsed CSV:", results);
        resolve(results.data);
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