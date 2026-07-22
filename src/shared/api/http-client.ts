type CsrfResponse = {
  headerName: string;
  parameterName: string;
  token: string;
};

export async function apiFetch(
  path: string,
  options: RequestInit = {},
) {
  return fetch(path, {
    ...options,
    credentials: "include",
  });
}

export async function csrfFetch(
  path: string,
  options: RequestInit = {},
) {
  const csrfResponse = await apiFetch("/api/auth/csrf");

  if (!csrfResponse.ok) {
    throw new Error("Failed to retrieve CSRF token");
  }

  const csrf = await csrfResponse.json() as CsrfResponse;
  const headers = new Headers(options.headers);

  headers.set(csrf.headerName, csrf.token);

  return apiFetch(path, {
    ...options,
    headers,
  });
}