import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as authApi from "../services/authApi";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authApi.verifyEmail(token);
        if (response.success) {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in.");
          toast.success("Email verified successfully!");
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Email verification failed. The link may be invalid or expired.");
        toast.error("Email verification failed.");
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        {status === "verifying" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Verifying Email...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent)] mx-auto"></div>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p className="text-[var(--color-text-muted)] mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block w-full bg-[var(--color-accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-red-500 text-6xl mb-4">✕</div>
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-[var(--color-text-muted)] mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block w-full bg-[var(--color-accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              Try Registering Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
