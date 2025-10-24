import type { Difficulty } from "./types";

const songNameMap = await fetch("songNameMap.json").then((res) => res.json());

export function getPotentialColor(potential: number): string {
  try {
    if (potential >= 13.0) {
      return "#CF4376"; // 207, 67, 118
    } else if (potential >= 12.5) {
      return "#AE1160"; // 174, 17, 96
    } else if (potential >= 12.0) {
      return "#CF677A"; // 207, 103, 122
    } else if (potential >= 11.0) {
      return "#A9122E"; // 169, 18, 46
    } else if (potential >= 10.0) {
      return "#A653AD"; // 166, 83, 173
    } else if (potential >= 7.0) {
      return "#7C3787"; // 124, 55, 135
    } else if (potential >= 3.5) {
      return "#49B1D7"; // 73, 177, 215
    } else {
      return "#3F8994"; // 63, 137, 148
    }
  } catch (e) {
    console.error(e);
    return "#797979"; // 121, 121, 121
  }
}

export function getGrade(score: number): string {
  if (score >= 10_000_000) return "PM";
  else if (score >= 9_900_000) return "EX+";
  else if (score >= 9_800_000) return "EX";
  else if (score >= 9_500_000) return "AA";
  else if (score >= 9_200_000) return "A";
  else if (score >= 8_900_000) return "B";
  else if (score >= 8_600_000) return "C";
  else return "D";
}

export function getDifficultyColor(diff: Difficulty): string {
  const diffColors: Record<string, string> = {
    byd: "#b35757",
    etr: "#7b60d1",
    ftr: "#a653ad",
    prs: "#d8d391",
    pst: "#49b1d7",
  };

  return diffColors[diff.toLowerCase()] || "#bebebeff";
}

export async function getSongJacket(title: string, diff: Difficulty): Promise<HTMLImageElement | null> {
  const songName = (await unicodeToText(title))
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/!|\*|#|\[|\]|\?|:|,|\||\\/g, "");

  const diffPath = `jackets/${songName}_${diff.toLowerCase()}.jpg`;
  const basePath = `jackets/${songName}.jpg`;

  if (await imageExists(diffPath)) {
    const img = new Image();
    img.src = diffPath;
    return img;
  }

  if (await imageExists(basePath)) {
    const img = new Image();
    img.src = basePath;
    return img;
  }
  
  return null;

  async function imageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }
}

async function unicodeToText(text: string): Promise<string> {
  return songNameMap[text] || text;
}
