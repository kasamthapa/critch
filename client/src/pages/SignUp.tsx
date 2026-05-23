import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { signUp } from "../api/auth.api";

import type { SignUpRequest } from "../types/auth.types";

export function SignUp() {
  const initialValue = {
    username: "",
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialValue);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);

    const payload: SignUpRequest = {
      ...formValues,
    };

    try {
      await signUp(payload);

      navigate("/signin", {
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-zinc-800">Create Account</h1>

            <p className="text-zinc-500 mt-2">
              Join and start sharing your projects
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block mb-2 font-medium text-zinc-700"
              >
                Username
              </label>

              <input
                type="text"
                id="username"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 font-medium text-zinc-700"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-zinc-700"
              >
                Password
              </label>

              <input
                type="password"
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-black text-white font-medium hover:bg-zinc-800 transition disabled:opacity-60"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}

          {/* Footer */}
          <p className="text-sm text-zinc-500 text-center mt-6">
            Already have an account?
            <span
              onClick={() => navigate("/signin")}
              className="ml-1 text-black font-medium cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
