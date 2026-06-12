import React from "react";

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] flex">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-lg p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Reset Password
            </h2>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Create a new password for your account
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium">
                New Password
              </label>
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
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
