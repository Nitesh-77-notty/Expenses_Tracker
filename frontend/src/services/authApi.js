import request from "./api";

export const register = async (data) => {
  return request(
    "/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    false,
  );
};

export const login = async (data) => {
  return request(
    "/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    true,
  );
};

export const logout = async () => {
  return request("/auth/logout", {
    method: "POST",
  });
};

export const verifyEmail = async (token) => {
  return request(`/auth/verify-email/${token}`, {
    method: "GET",
  });
};

export const forgotPassword = async (data) => {
  return request(
    "/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    false,
  );
};

export const resetPassword = async (token, data) => {
  return request(
    `/auth/reset-password/${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    false,
  );
};

export const getMe = async () => {
  return request("/auth/me", {
    method: "GET",
  });
};
