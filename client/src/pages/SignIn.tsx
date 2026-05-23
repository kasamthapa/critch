import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import type { SignInRequest } from "../types/auth.types";

import { signIn } from "../api/auth.api";

import { useAuth } from "../hooks/useAuth";

export function SignIn() {
  const initialValue = {
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialValue);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const message = location.state?.message;

  const { login } = useAuth();

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

    const payload: SignInRequest = {
      ...formValues,
    };

    try {
      const response = await signIn(payload);

      login(response.data);

      navigate("/", {
        state: {
          message: "You are signed in successfully",
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
            <h1 className="text-4xl font-bold text-zinc-800">Welcome Back</h1>

            <p className="text-zinc-500 mt-2">Sign in to continue</p>
          </div>

          {/* Flash Message */}
          {message && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your password"
                className="w-full border border-zinc-200 rounded-2xl px-4 py-3 bg-zinc-50 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-black text-white font-medium hover:bg-zinc-800 transition disabled:opacity-60"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
