export function getLocalData(): Record<string, string>[] {
  const data = localStorage.getItem("data");
  return data ? JSON.parse(data) : [];
}

export function getLocalUsername(): string {
  const username = localStorage.getItem("username");
  return username || "";
}

export function getLocalUserPotential(): number {
  const potential = localStorage.getItem("user-potential");
  return potential ? Number(potential) : 0;
}

export function setLocalData(data: Record<string, string>[]) {
  localStorage.setItem("data", JSON.stringify(data));
}

export function setLocalUsername(username: string) {
  localStorage.setItem("username", username);
}

export function setLocalUserPotential(potential: number) {
  localStorage.setItem("user-potential", String(potential));
}