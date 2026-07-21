export function validateUsername(username: string): string | null {
  if (username.trim().length === 0) {
    return "Username is required";
  }

  return null;
}