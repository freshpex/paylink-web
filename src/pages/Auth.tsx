import { useState, type FormEvent } from "react";
import { ArrowUpRight, Link2, Layers3, FileCheck2 } from "lucide-react";
import { api, send } from "../lib/api";
import type { User } from "../lib/types";
import { Button, Field, Alert } from "../components/ui";
export function Auth({ onLogin }: { onLogin: (u: User) => void }) {
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      onLogin(
        await api<User>(
          `/auth/${register ? "register" : "login"}`,
          send("POST", data),
        ),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <aside className="auth-story">
        <div className="wordmark">
          <span className="brand-mark">
            <Link2 />
          </span>{" "}
          paylink<span className="tiny-tag">FOR BUSINESS</span>
        </div>
        <div>
          <span className="eyebrow">A MORE PERSONAL WAY TO GET PAID</span>
          <h1>
            Your business.
            <br />
            Your brand.
            <br />
            <em>Your payment link.</em>
          </h1>
          <p>
            Turn a simple request into a thoughtful payment experience. From the
            first link to the final receipt.
          </p>
          <div className="story-benefits">
            <span>
              <Layers3 size={18} /> Every company, one workspace
            </span>
            <span>
              <FileCheck2 size={18} /> Beautiful, branded receipts
            </span>
          </div>
        </div>
        <small>Made for the way you do business.</small>
      </aside>
      <main className="auth-form">
        <div className="w-full max-w-sm">
          <span className="eyebrow text-indigo-600">
            LET’S MAKE IT OFFICIAL
          </span>
          <h2>{register ? "Create your workspace" : "Welcome back."}</h2>
          <p className="muted mb-8">
            {register
              ? "A better payment experience starts here."
              : "Your companies and payment links are right here."}
          </p>
          {error && <Alert>{error}</Alert>}
          <form onSubmit={submit} className="form-stack">
            {register && (
              <>
                <Field label="Your name">
                  <input name="name" required autoComplete="name" />
                </Field>
                <Field label="Company name">
                  <input name="company_name" required maxLength={120} />
                </Field>
              </>
            )}
            <Field label="Email address">
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
              />
            </Field>
            <Field
              label="Password"
              hint={register ? "Use at least 12 characters." : undefined}
            >
              <input
                name="password"
                type="password"
                required
                minLength={register ? 12 : 1}
                maxLength={128}
                autoComplete={register ? "new-password" : "current-password"}
              />
            </Field>
            <Button busy={busy} type="submit">
              {register ? "Create workspace" : "Sign in"}{" "}
              <ArrowUpRight size={17} />
            </Button>
          </form>
          <p className="mt-6 text-sm muted">
            {register ? "Already have a workspace?" : "New to Paylink?"}{" "}
            <button
              className="text-indigo-600 font-semibold"
              onClick={() => {
                setRegister(!register);
                setError("");
              }}
            >
              {register ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
