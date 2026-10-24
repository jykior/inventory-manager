import { clearCsrf, csrfFetch } from "./csrfApi";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  const response = await csrfFetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("LOGIN_FAILED");
    } else if (response.status === 400) {
      throw new Error("LOGIN_REQUEST_INVALID");
    } else {
      throw new Error("LOGIN_REQUEST_FAILED");
    }
  }
  return await response.json();
};

export const logout = async () => {
  const response = await csrfFetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
  });
  clearCsrf();
  if (!response.ok) {
    throw new Error("LOGOUT_FAILED");
  }
};

export const guestLogin = async () => {
  const response = await csrfFetch(`${API_URL}/api/guest/login`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("GUEST_LOGIN_FAILED");
  }
  return await response.json();
};

export const guestLogout = async () => {
  const response = await csrfFetch(`${API_URL}/api/guest/logout`, {
    method: "POST",
  });
  clearCsrf();
  if (!response.ok) {
    throw new Error("GUEST_LOGOUT_FAILED");
  }
};

export const userRegister = async (
  email,
  password,
  confirmPassword,
  nickname,
) => {
  const response = await csrfFetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword, nickname }),
  });
  if (!response.ok) {
    if (response.status === 422) {
      throw new Error("PASSWORD_MISMATCH");
    } else if (response.status === 409) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    } else {
      throw new Error("REGISTER_FAILED");
    }
  }
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/api/auth/users`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("GET_USERS_FAILED");
  }
  return await response.json();
};

export const updateUserRole = async (id, role) => {
  const response = await csrfFetch(`${API_URL}/api/auth/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("ADMIN_ALREADY_EXISTS");
    } else if (response.status === 404) {
      throw new Error("USER_NOT_FOUND");
    } else {
      throw new Error("UPDATE_USER_ROLE_FAILED");
    }
  }
};

export const updateEmail = async (email) => {
  const response = await csrfFetch(`${API_URL}/api/auth/email`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    } else if (response.status === 400) {
      throw new Error("EMAIL_REQUEST_INVALID");
    } else {
      throw new Error("UPDATE_EMAIL_FAILED");
    }
  }
  return await response.json();
};

export const updatePassword = async (password) => {
  const response = await csrfFetch(`${API_URL}/api/auth/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("SAME_PASSWORD");
    } else if (response.status === 400) {
      throw new Error("PASSWORD_REQUEST_INVALID");
    } else {
      throw new Error("UPDATE_PASSWORD_FAILED");
    }
  }
};

export const updateNickname = async (nickname) => {
  const response = await csrfFetch(`${API_URL}/api/auth/nickname`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("NICKNAME_REQUEST_INVALID");
    }
    throw new Error("NICKNAME_UPDATE_FAILED");
  }
  return await response.json();
};

export const deleteAccount = async () => {
  const response = await csrfFetch(`${API_URL}/api/auth`, {
    method: "DELETE",
  });
  clearCsrf();
  if (!response.ok) {
    throw new Error("ACCOUNT_DELETE_FAILED");
  }
};
