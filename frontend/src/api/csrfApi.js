const API_URL = import.meta.env.VITE_API_URL;
let csrf = null;

export const getCsrfHeaders = async () => {
  if (!csrf) {
    const res = await fetch(`${API_URL}/api/auth/csrf`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("CSRF_FETCH_FAILED");
    csrf = await res.json();
  }
  return { [csrf.headerName]: csrf.token };
};

export const clearCsrf = () => {
  csrf = null;
};

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  const isLoginRequest =
    url.endsWith("/api/auth/login") ||
    url.endsWith("/api/guest/login");

  if (response.status === 401 && !isLoginRequest) {
    window.dispatchEvent(new Event("auth:unauthorized"));
  }

  return response;
};

export const csrfFetch = async (url, options = {}) => {
  const send = async () =>
    apiFetch(url, {
      ...options,
      headers: { ...options.headers, ...(await getCsrfHeaders()) },
      credentials: "include",
    });

  let response = await send();
  if (response.status === 403) {
    clearCsrf();
    response = await send();
  }
  return response;
};
