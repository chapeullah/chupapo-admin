export function validatePassword(password: string): string | null {
  if (password.length === 0) {
    return "Password is required";
  }

  return null;
}