import request from "./api";

export const register = async (data) => {
  return request(
    "/auth/register",
    {
      method: "POST",
      header: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify(data),
    },
    false,
  );
};
