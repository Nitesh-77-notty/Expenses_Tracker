import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      if (response.success) {
        toast.success("Password reset link has been sent to your email.");
        setEmail("");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Forgot Password
            </h2>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Enter your email to receive a reset link
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[var(--color-text-muted)]">
            Remember your password?{" "}
            <Link to="/login" className="text-[var(--color-accent)] font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
