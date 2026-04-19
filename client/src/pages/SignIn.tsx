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
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const payload: SignInRequest = { ...formValues };
    try {
      const response = await signIn(payload);
      login(response.data);

      navigate("/", {
        state: { message: "You are signed in successfully" },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div>
      <p>{message}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "...Loading" : "SignIn"}
        </button>
      </form>
      <p>{error}</p>
    </div>
  );
}
