import "./sign-in-form.css";

import { useLogin } from "ra-core";
import {
  useState,
  type SubmitEvent as ReactSubmitEvent
} from "react";

import { validateUsername } from "./validate-username.ts";
import { validatePassword } from "./validate-password.ts";

export default function SignInForm() {

  const login = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: ReactSubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    const usernameValidationResult = validateUsername(username);
    const passwordValidationResult = validatePassword(password);
    if (usernameValidationResult !== null) {
      setError(usernameValidationResult);
      return;
    }
    if (passwordValidationResult !== null) {
      setError(passwordValidationResult);
      return;
    }

    setPending(true);

    try {
      await login({ username, password });
    }
    catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Unable to sign in");
    }
    finally {
      setPending(false);
    }
  }

  return (
    <form
      className="sign-in-form"
      onSubmit={handleLogin}
      noValidate={true}
    >
      <h1 className="sign-in-form__title">Chupapo Admin</h1>

      <input
        className="sign-in-form__input"
        name="username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="username"
      />

      <input
        className="sign-in-form__input"
        name="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
      />

      <button
        className="sign-in-form__submit"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign in "}
      </button>

      {error &&
        <p className="sign-in-form__error">{error}</p>
      }
    </form>
  );
};