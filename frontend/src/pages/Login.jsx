import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Welcome Back
            </h2>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Sign in to continue to SpendWise
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-[var(--color-text-primary)]">
                Email
              </label>

              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-[var(--color-text-primary)]">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-light)]"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-[var(--color-accent)] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-accent)] text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[var(--color-text-muted)]">
            Don't have an account?{" "}
            <button className="text-[var(--color-accent)] font-medium hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
