import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/auth.api";
import type { SignUpRequest } from "../types/auth.types";
import { userSignupSchema } from "../schemas/authSchema";

export function SignUp() {
  const initialValue = { username: "", email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValue);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignUpRequest, string>>
  >({});
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof SignUpRequest]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) {
      setError("");
    }
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setError("");
    const validation = userSignupSchema.safeParse(formValues);
    if (!validation.success) {
      const errorsObj: Partial<Record<keyof SignUpRequest, string>> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof SignUpRequest;
        errorsObj[fieldName] = issue.message;
      });
      setFieldErrors(errorsObj);
      return;
    }
    setIsSubmitting(true);
    const payload: SignUpRequest = validation.data;
    try {
      await signUp(payload);
      navigate("/signin", {
        state: { message: "Account created successfully. Please sign in." },
      });
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
            critch / signup
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">
            Create account
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 mt-2">
            Join and start sharing your projects
          </p>
        </div>

        <div className="h-px bg-zinc-800 mb-8 sm:mb-10" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="font-mono text-xs text-zinc-600 uppercase tracking-wider"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="yourhandle"
              className={`w-full border bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors font-mono min-h-[44px] ${
                fieldErrors.username
                  ? "border-red-500 focus:border-red-400"
                  : "border-zinc-700 focus:border-zinc-400"
              }`}
            />
            {fieldErrors.username && (
              <span className="font-mono text-xs text-red-400 mt-0.5">
                {fieldErrors.username}
              </span>
            )}
          </div>

          {/* Email */}
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
              className={`w-full border bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors font-mono min-h-[44px] ${
                fieldErrors.email
                  ? "border-red-500 focus:border-red-400"
                  : "border-zinc-700 focus:border-zinc-400"
              }`}
            />
            {fieldErrors.email && (
              <span className="font-mono text-xs text-red-400 mt-0.5">
                {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Password */}
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
              className={`w-full border bg-zinc-900 px-4 py-3 text-sm sm:text-base text-zinc-200 placeholder:text-zinc-600 outline-none transition-colors font-mono min-h-[44px] ${
                fieldErrors.password
                  ? "border-red-500 focus:border-red-400"
                  : "border-zinc-700 focus:border-zinc-400"
              }`}
            />
            {fieldErrors.password && (
              <span className="font-mono text-xs text-red-400 mt-0.5">
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Error Alert Box */}
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
            {isSubmitting ? "creating account···" : "sign up"}
          </button>

          <p className="text-center font-mono text-xs sm:text-sm text-zinc-600">
            already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-zinc-400 hover:text-zinc-200 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-400 transition-colors"
            >
              sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
