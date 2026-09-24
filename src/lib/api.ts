import { auth } from './firebase';

// Every staff screen talks to the API the same way — the Firebase ID token
// as a bearer, JSON both ways — and each one used to carry its own copy of
// this, each handling a missing session slightly differently.

export class SessionExpiredError extends Error {
  constructor() {
    super('Tu sesión expiró. Vuelve a iniciar sesión.');
  }
}

export async function authedFetch(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new SessionExpiredError();
  const token = await user.getIdToken();
  return fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
}

// A failed request, with the message ready to show and, when the server
// sent one, the machine-readable `code` a caller can branch on.
export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
  }
}

// Sends the request and returns the parsed body. On failure it throws an
// ApiError whose message is ready to show: the server's own explanation
// when it gave one, `fallback` otherwise.
export async function apiRequest<T = any>(url: string, fallback: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await authedFetch(url, options);
  } catch (e) {
    if (e instanceof SessionExpiredError) throw e;
    throw new ApiError('Error de conexión. Revisa tu internet.', 0);
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body?.error || fallback, res.status, body?.code);
  return body as T;
}
