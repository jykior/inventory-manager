const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("LOGIN_FAILED");
    }
    throw new Error("LOGIN_REQUEST_FAILED");
  }
  return await response.json();
};

export const guestLogin = async () => {
  const response = await fetch(`${API_URL}/api/guest/login`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("GUEST_LOGIN_FAILED");
  }

  return await response.json();
};

export const guestLogout = async () => {
  const response = await fetch(`${API_URL}/api/guest/logout`, {
    method: "POST",
    credentials: "include",
  });

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
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, confirmPassword, nickname }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    if (response.status === 400) {
      throw new Error("PASSWORD_MISMATCH");
    }
    throw new Error("REGISTER_FAILED");
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
  const response = await fetch(`${API_URL}/api/auth/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    throw new Error("UPDATE_USER_ROLE_FAILED");
  }
};

export const updateEmail = async (email) => {
  const response = await fetch(`${API_URL}/api/auth/email`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw new Error("UPDATE_EMAIL_FAILED");
  }
  return await response.json();
};

export const updatePassword = async (password) => {
  const response = await fetch(`${API_URL}/api/auth/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("SAME_PASSWORD");
    }
    throw new Error("UPDATE_PASSWORD_FAILED");
  }
};

export const updateNickname = async (nickname) => {
  const response = await fetch(`${API_URL}/api/auth/nickname`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ nickname }),
  });

  if (!response.ok) {
    throw new Error("NICKNAME_UPDATE_FAILED");
  }

  return await response.json();
};

export const deleteAccount = async () => {
  const response = await fetch(`${API_URL}/api/auth`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("ACCOUNT_DELETE_FAILED");
  }
};
