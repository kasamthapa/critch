import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SignInRequest } from "../types/auth.types";
import { signIn } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

export function SignIn() {
  const initialValue = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValue);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const { login } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const payload: SignInRequest = { ...formValues };
    try {
      const response = await signIn(payload);
      login(response.data);
      navigate("/", { state: { message: "You are signed in successfully" } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#111110] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="font-mono text-xs sm:text-sm text-zinc-600 tracking-widest uppercase mb-3">
            critch / signin
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
            Welcome back
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 mt-2">
            Sign in to continue
          </p>
        </div>

        <div className="h-px bg-zinc-800 mb-8 sm:mb-10" />

        {/* Flash */}
        {message && (
          <div className="mb-6 flex items-start gap-3 border-l-2 border-emerald-500 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
            <span className="font-mono text-emerald-500 select-none">✓</span>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-zinc-400 transition-colors font-mono min-h-[44px]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 border-l-2 border-red-500 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              <span className="font-mono text-red-500 select-none">✕</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 border border-zinc-600 bg-zinc-800 font-mono text-sm text-zinc-100 hover:border-zinc-400 hover:bg-zinc-700 hover:text-white transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed mt-1"
          >
            {isSubmitting ? "signing in···" : "sign in"}
          </button>

          <p className="text-center font-mono text-xs sm:text-sm text-zinc-600">
            don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-zinc-400 hover:text-zinc-200 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-400 transition-colors"
            >
              sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
