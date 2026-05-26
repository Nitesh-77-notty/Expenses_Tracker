import toast from "react-hot-toast";

const API_URL = import.meta.env.API_URL;
export const register = async (data) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      header: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    toast.error(error.message);
  }
};
