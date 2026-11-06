import { useState, type FormEvent } from "react";
import { Plus, ArrowUpRight, Trash2, ArrowRight } from "lucide-react";
import { api, send, uploadMedia } from "../lib/api";
import type { Company, Method } from "../lib/types";
import { Alert, Button, Field } from "../components/ui";
import { PaymentPreview } from "../components/PaymentPreview";
export function LinkEditor({
  company,
  onCancel,
  onCreated,
}: {
  company: Company;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    category: "tuition",
    amount: 0,
    currency: "USD",
    theme: "classic",
    hero_url: "",
    recipient_name: "",
    recipient_email: "",
    note: "",
    receipt_heading: "Payment receipt",
    receipt_footer: "Thank you for your payment. We appreciate your business.",
  });
  const [amount, setAmount] = useState(""),
    [methods, setMethods] = useState<Method[]>([
      { label: "International bank transfer", details: "" },
    ]),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [error, setError] = useState("");
  function update(key: string, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const cents = Math.round(Number(amount) * 100);
      if (!Number.isFinite(cents) || cents < 100)
        throw new Error("Enter an amount of at least 1.00.");
      await api(
        `/companies/${company.id}/links`,
        send("POST", {
          ...draft,
          amount: cents,
          methods,
          hero_url: draft.hero_url || null,
          recipient_name: draft.recipient_name || null,
          recipient_email: draft.recipient_email || null,
        }),
      );
      onCreated();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE IT PERSONAL</span>
          <h1>Create a payment link</h1>
          <p>Your details. Your branding. Ready to share.</p>
        </div>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <div className="editor-layout">
        <form className="data-panel editor-form form-stack" onSubmit={submit}>
          {error && <Alert>{error}</Alert>}
          <h3>01 · The payment</h3>
          <Field label="Payment title">
            <input
              required
              maxLength={160}
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Spring semester tuition"
            />
          </Field>
          <Field label="Description">
            <textarea
              maxLength={3000}
              value={draft.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Tell your customer what this payment is for."
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount">
              <input
                required
                type="number"
                min="1"
                max="1000000"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Field>
            <Field label="Currency">
              <select
                value={draft.currency}
                onChange={(e) => update("currency", e.target.value)}
              >
                {["USD", "NGN", "GBP", "EUR"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Payment category">
            <select
              value={draft.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {["tuition", "invoice", "service", "donation", "other"].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Recipient name (private, optional)">
              <input
                maxLength={120}
                value={draft.recipient_name}
                onChange={(e) => update("recipient_name", e.target.value)}
              />
            </Field>
            <Field label="Recipient email (private, optional)">
              <input
                type="email"
                value={draft.recipient_email}
                onChange={(e) => update("recipient_email", e.target.value)}
              />
            </Field>
          </div>
          <hr />
          <h3>02 · Ways to pay</h3>
          <p className="muted text-sm">
            List only methods your company can receive. Enter the exact account,
            wallet, email, network, or transfer instructions the customer needs.
          </p>
          {methods.map((m, i) => (
            <div className="method-editor" key={i}>
              <div className="flex justify-between items-center mb-3">
                <strong>Method {i + 1}</strong>
                {methods.length > 1 && (
                  <button
                    type="button"
                    aria-label="Remove payment method"
                    onClick={() =>
                      setMethods(methods.filter((_, n) => n !== i))
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <Field label="Method name">
                <input
                  required
                  maxLength={80}
                  list="methods"
                  value={m.label}
                  onChange={(e) =>
                    setMethods(
                      methods.map((x, n) =>
                        n === i ? { ...x, label: e.target.value } : x,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Payment destination & instructions">
                <textarea
                  required
                  maxLength={3000}
                  rows={5}
                  value={m.details}
                  onChange={(e) =>
                    setMethods(
                      methods.map((x, n) =>
                        n === i ? { ...x, details: e.target.value } : x,
                      ),
                    )
                  }
                  placeholder="Account name, bank, IBAN / SWIFT, PayPal email, or crypto address and network…"
                />
              </Field>
            </div>
          ))}
          <datalist id="methods">
            {[
              "International bank transfer",
              "Local bank transfer",
              "PayPal",
              "Apple Pay instructions",
              "USDT / Crypto",
              "Other",
            ].map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          <Button
            type="button"
            variant="secondary"
            disabled={methods.length >= 10}
            onClick={() => setMethods([...methods, { label: "", details: "" }])}
          >
            <Plus size={15} /> Add a payment method
          </Button>
          <hr />
          <h3>03 · Make it yours</h3>
          <Field label="Page style">
            <select
              value={draft.theme}
              onChange={(e) => update("theme", e.target.value)}
            >
              {["classic", "minimal", "bold"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field
            label="Cover image or video"
            hint="Cloudinary upload · up to 20 MB"
          >
            <input
              type="file"
              disabled={uploading}
              accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setUploading(true);
                try {
                  update("hero_url", await uploadMedia(company.id, f));
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setUploading(false);
                }
              }}
            />
          </Field>
          {draft.hero_url && (
            <button
              type="button"
              className="text-button"
              onClick={() => update("hero_url", "")}
            >
              Remove cover
            </button>
          )}
          <Field label="Additional notes or terms">
            <textarea
              maxLength={1000}
              value={draft.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="Due dates, transfer fees, or important information."
            />
          </Field>
          <Field label="Receipt heading">
            <input
              required
              maxLength={100}
              value={draft.receipt_heading}
              onChange={(e) => update("receipt_heading", e.target.value)}
            />
          </Field>
          <Field label="Receipt message">
            <textarea
              maxLength={1000}
              value={draft.receipt_footer}
              onChange={(e) => update("receipt_footer", e.target.value)}
            />
          </Field>
          <Button type="submit" busy={busy} disabled={uploading}>
            Save & create link <ArrowUpRight size={17} />
          </Button>
        </form>
        <aside className="preview-column">
          <span className="eyebrow">LIVE PREVIEW</span>
          <p className="muted text-sm mb-5">
            A little preview of a great first impression.
          </p>
          <PaymentPreview
            company={company}
            link={{ ...draft, amount: Math.round(Number(amount) * 100) || 0 }}
          >
            <div className="preview-method mt-6">
              {methods.map((m, i) => (
                <div key={i}>
                  {m.label || "Payment method"} <ArrowRight size={14} />
                </div>
              ))}
            </div>
          </PaymentPreview>
        </aside>
      </div>
    </>
  );
}
