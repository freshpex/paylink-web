import { useState, type FormEvent } from "react";
import { ArrowUpRight, Link2, Layers3, FileCheck2 } from "lucide-react";
import { api, send } from "../lib/api";
import type { User } from "../lib/types";
import { Button, Field, Alert } from "../components/ui";
import { useI18n } from "../lib/i18n";
export function Auth({ onLogin }: { onLogin: (u: User) => void }) {
  const { t } = useI18n();
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
          paylink<span className="tiny-tag">{t("FOR BUSINESS")}</span>
        </div>
        <div>
          <span className="eyebrow">{t("A MORE PERSONAL WAY TO GET PAID")}</span>
          <h1>
            {t("Your business.")}
            <br />
            {t("Your brand.")}
            <br />
            <em>{t("Your payment link.")}</em>
          </h1>
          <p>{t("Turn a simple request into a thoughtful payment experience. From the first link to the final receipt.")}</p>
          <div className="story-benefits">
            <span>
              <Layers3 size={18} /> {t("Every company, one workspace")}
            </span>
            <span>
              <FileCheck2 size={18} /> {t("Beautiful, branded receipts")}
            </span>
          </div>
        </div>
        <small>{t("Made for the way you do business.")}</small>
      </aside>
      <main className="auth-form">
        <div className="w-full max-w-sm">
          <span className="eyebrow text-indigo-600">
            {t("LET’S MAKE IT OFFICIAL")}
          </span>
          <h2>{t(register ? "Create your workspace" : "Welcome back.")}</h2>
          <p className="muted mb-8">
            {register
              ? t("A better payment experience starts here.")
              : t("Your companies and payment links are right here.")}
          </p>
          {error && <Alert>{error}</Alert>}
          <form onSubmit={submit} className="form-stack">
            {register && (
              <>
                <Field label={t("Your name")}>
                  <input name="name" required autoComplete="name" />
                </Field>
                <Field label={t("Company name")}>
                  <input name="company_name" required maxLength={120} />
                </Field>
              </>
            )}
            <Field label={t("Email address")}>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
              />
            </Field>
            <Field
              label={t("Password")}
              hint={register ? t("Use at least 12 characters.") : undefined}
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
              {t(register ? "Create workspace" : "Sign in")}{" "}
              <ArrowUpRight size={17} />
            </Button>
          </form>
          <p className="mt-6 text-sm muted">
            {t(register ? "Already have a workspace?" : "New to Paylink?")}{" "}
            <button
              className="text-indigo-600 font-semibold"
              onClick={() => {
                setRegister(!register);
                setError("");
              }}
            >
              {t(register ? "Sign in" : "Create an account")}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
