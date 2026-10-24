/* eslint-disable @next/next/no-img-element */
"use client";
import { ComponentProps, useState } from "react";
import { useCsrf } from "../context/csrf/CsrfContext";
import { redirect } from "next/navigation";

type Mode = "signup" | "signin";

export default function EmailPasswordComponent() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [valError, setValError] = useState<Record<string, string>>({});

  const [globalError, setGlobalError] = useState("");

  const { csrfToken } = useCsrf();

  const clearError = () => {
    setValError({});
    setGlobalError("");
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const onSubmitSignIn: NonNullable<
    ComponentProps<"form">["onSubmit"]
  > = async (e) => {
    e.preventDefault();

    clearError();

    const validationError: Record<string, string> = {};

    if (!validateEmail(email)) {
      validationError["email"] = "Please enter a valid email address.";
      return;
    }

    setValError(validationError);
    if (Object.keys(valError).length !== 0) {
      return;
    }

    try {
      console.log(csrfToken);
      const response = await fetch("/api/signin", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setGlobalError(result.error);
        return;
      }

      console.log(response);

      // Sign-in succeeded.
      // Redirect or refresh the UI as appropriate.
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
        setGlobalError("A network error occurred. Please try again.");
        return;
      }
    }
    redirect("/");
  };

  const onSubmitSignUp: NonNullable<
    ComponentProps<"form">["onSubmit"]
  > = async (e) => {
    e.preventDefault();
    clearError();

    const validationError: Record<string, string> = {};

    if (!validateEmail(email)) {
      validationError["email"] = "Please enter a valid email address.";
      return;
    }

    if (name.length < 1) {
      validationError["name"] = "Name is required.";
    }

    if (password.length < 1) {
      validationError["password"] = "Password is required.";
    } else if (password.length < 8) {
      validationError["password"] = "Password must be more than 8 characters";
    }

    if (password !== confirmPassword) {
      validationError["confirmpassword"] = "Password don't matched.";
    }

    setValError(validationError);

    console.log(valError);

    if (Object.keys(valError).length !== 0) {
      return;
    }

    try {
      console.log(csrfToken);
      const response = await fetch("/api/signup", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          email,
          password,
          confirm: confirmPassword,
          name,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        setGlobalError(result.error);
        return;
      }
      
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
        setGlobalError("A network error occurred. Please try again.");
        return;
      }
    }
    redirect("/");
  };

  return (
    <section id='login'>
      <div className='containers'>
        {mode === ("signin" as Mode) ? (
          <form onSubmit={(e) => onSubmitSignIn(e)} method='POST'>
            <h1>Sign In</h1>
            {/* Form input */}
            <div className='login-input'>
              <input
                type='email'
                name='email'
                id='signin-email'
                placeholder='Email'
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <img src='/email.png' alt='email' width={20} height={20} />
              <span className='error-message'>{valError["email"] ?? ""}</span>
            </div>
            <div className='login-input'>
              <input
                type='password'
                name='password'
                id='signin-password'
                placeholder='Password'
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className='error-message'>
                {valError["password"] ?? ""}
              </span>
              <img src='/padlock.png' alt='email' width={18} height={18} />
            </div>
            <p className='error-message px-4'>{globalError}</p>

            <div className='submit-form'>
              <button className='submit-button' type='submit'>
                Sign In
              </button>
              <p>
                Don&apos;t have an account?{" "}
                <span className='font-bold'>
                  <button
                    type='button'
                    onClick={() => {
                      clearError();
                      setMode("signup");
                    }}
                  >
                    Sign Up
                  </button>
                </span>
              </p>
            </div>
          </form>
        ) : (
          <form method='POST' onSubmit={(e) => onSubmitSignUp(e)}>
            {/* Form input */}
            <h1>Sign Up</h1>

            <div className='login-input'>
              <input
                type='email'
                name='email'
                id='signup-email'
                placeholder='Email'
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <img src='/email.png' alt='email' width={20} height={20} />

              <span className='error-message'>{valError["email"] ?? ""}</span>
            </div>
            <div className='login-input'>
              <input
                type='text'
                name='name'
                id='signup-name'
                placeholder='Name'
                required
                onChange={(e) => setName(e.target.value)}
              />
              <img src='/account.png' alt='profile' width={20} height={20} />

              <span className='error-message'>{valError["name"] ?? ""}</span>
            </div>
            <div className='login-input'>
              <input
                type='password'
                name='password'
                id='signup-password'
                placeholder='Password'
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <img src='/padlock.png' alt='email' width={18} height={18} />

              <span className='error-message'>
                {valError["password"] ?? ""}
              </span>
            </div>
            <div className='login-input'>
              <input
                type='password'
                name='confirmpassword'
                id='signup-confirmpassword'
                placeholder='Confirm Password'
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <span className='error-message'>
                {valError["confirmpassword"] ?? ""}
              </span>
            </div>
            <p className='error-message px-4'>{globalError}</p>

            <div className='submit-form'>
              <button className='submit-button' type='submit'>
                Sign Up
              </button>
              <p>
                Already have an account?{" "}
                <span className='font-bold'>
                  <button
                    type='button'
                    onClick={() => {
                      clearError();
                      setMode("signin");
                    }}
                  >
                    Sign In
                  </button>
                </span>
              </p>
            </div>
          </form>
        )}
      </div>
      <div className='login-background' />
    </section>
  );
}
