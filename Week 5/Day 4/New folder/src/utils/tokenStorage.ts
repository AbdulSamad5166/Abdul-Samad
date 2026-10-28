const TOKEN_KEY = "auth-forms-access-token";

// Local storage is convenient but exposed to XSS; production apps often use httpOnly cookies.
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
