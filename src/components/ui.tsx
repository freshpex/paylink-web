import { useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { Copy, Check, LoaderCircle, ArrowUpRight } from "lucide-react";
import { useI18n } from "../lib/i18n";
export function Button({
  children,
  busy = false,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  busy?: boolean;
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      {...props}
      disabled={busy || props.disabled}
      className={`btn btn-${variant} ${props.className || ""}`}
    >
      {busy && <LoaderCircle size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Alert({ children }: { children: ReactNode }) {
  return (
    <div role="alert" className="alert">
      {children}
    </div>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty">
      <ArrowUpRight className="mx-auto mb-3 text-indigo-500" />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function CopyButton({
  value,
  label = "Copy link",
}: {
  value: string;
  label?: string;
}) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setDone(true);
            setTimeout(() => setDone(false), 2000);
          } catch {
            setError(true);
          }
        }}
      >
        {done ? <Check size={14} /> : <Copy size={14} />}{" "}
        {done ? t("Copied") : t(label)}
      </button>
      {error && (
        <input
          aria-label={t("Copy this link manually")}
          readOnly
          value={value}
          onFocus={(e) => e.target.select()}
        />
      )}
    </>
  );
}
export function Brand({ name, logo }: { name: string; logo?: string | null }) {
  return (
    <div className="brand">
      {logo ? (
        <img src={logo} alt="" className="company-logo" />
      ) : (
        <span className="brand-mark">{name.slice(0, 1)}</span>
      )}
      <span>{name}</span>
    </div>
  );
}
export function Status({ status }: { status: string }) {
  const { t } = useI18n();
  return (
    <span className={`badge ${status}`}>
      {status === "paid"
        ? t("Confirmed")
        : status === "pending"
          ? t("Awaiting review")
          : status === "active"
            ? t("Active")
            : status === "inactive"
              ? t("Paused")
              : t("Rejected")}
    </span>
  );
}
