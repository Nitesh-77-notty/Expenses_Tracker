import React from "react";

const Register = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Create Account
            </h2>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Start managing your finances with SpendWise
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--color-accent)] text-white py-3 rounded-xl font-medium"
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[var(--color-text-muted)]">
            Already have an account?{" "}
            <button className="text-[var(--color-accent)] font-medium">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
