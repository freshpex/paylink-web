import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, ExternalLink } from "lucide-react";
import { api, send } from "../lib/api";
import type { PaymentLink } from "../lib/types";
import { PaymentPreview } from "../components/PaymentPreview";
import { Alert, Button, Field } from "../components/ui";
export function Checkout() {
  const { id } = useParams();
  const [search, setSearch] = useSearchParams();
  const pid = search.get("claim");
  const [link, setLink] = useState<PaymentLink>(),
    [error, setError] = useState(""),
    [selected, setSelected] = useState(0),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState("pending");
  const [key, setKey] = useState(() => crypto.randomUUID());
  useEffect(() => {
    api<PaymentLink>(`/public/links/${id}`)
      .then(setLink)
      .catch((e) => setError(e.message));
  }, [id]);
  useEffect(() => {
    if (!pid) return;
    let live = true;
    const poll = () =>
      api<{ status: string }>(`/public/payments/${pid}/status`)
        .then((p) => {
          if (live) setStatus(p.status);
        })
        .catch((e) => {
          if (live) setError(e.message);
        });
    poll();
    const t = setInterval(poll, 10000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [pid]);
  async function claim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const p = await api<{ payment_id: string }>(
        `/public/links/${id}/claims`,
        send("POST", { ...data, method_index: selected, request_key: key }),
      );
      setSearch({ claim: p.payment_id });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="public-shell">
      <div className="public-intro">
        <span className="eyebrow">A PAYMENT REQUEST, JUST FOR YOU</span>
        <p>Review the details. Pay your way.</p>
      </div>
      {error && <Alert>{error}</Alert>}
      {link?.company ? (
        <PaymentPreview link={link} company={link.company}>
          {pid ? (
            <div className="claim-state">
              {status === "paid" ? (
                <CheckCircle2 className="text-emerald-600 mx-auto" size={38} />
              ) : (
                <Clock3 className="text-indigo-500 mx-auto" size={38} />
              )}
              <h2>
                {status === "paid"
                  ? "Payment confirmed"
                  : status === "rejected"
                    ? "Payment could not be verified"
                    : "You’ve done your part."}
              </h2>
              <p>
                {status === "paid"
                  ? "Your company has confirmed receipt of your payment."
                  : status === "rejected"
                    ? "Please contact the company to resolve your payment."
                    : "Your payment report is awaiting company confirmation. Keep this page to check its status."}
              </p>
              {status === "paid" && (
                <Link className="btn btn-primary" to={`/receipt/${pid}`}>
                  View & download receipt <ArrowRight size={16} />
                </Link>
              )}
              <small>Only the company can confirm funds have arrived.</small>
              {status === "rejected" && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch({});
                    setKey(crypto.randomUUID());
                  }}
                >
                  Submit another report
                </Button>
              )}
            </div>
          ) : (
            <form onSubmit={claim} className="form-stack mt-7">
              <h3>Choose how to pay</h3>
              <div className="method-choices">
                {link.methods.map((m, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => {
                      setSelected(i);
                      setKey(crypto.randomUUID());
                    }}
                    className={selected === i ? "selected" : ""}
                  >
                    <span className="radio-dot" />
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="instructions">
                <span className="eyebrow">PAYMENT DETAILS</span>
                <h3>{link.methods[selected]?.label}</h3>
                <p className="whitespace-pre-wrap break-words">
                  {link.methods[selected]?.details}
                </p>
                <small>
                  Transfer the amount using these details before reporting
                  payment below.
                </small>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your full name">
                  <input
                    name="name"
                    required
                    maxLength={120}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email for your receipt">
                  <input
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                  />
                </Field>
              </div>
              <Field label="Transfer reference (optional)">
                <input
                  name="transfer_reference"
                  maxLength={255}
                  placeholder="Transaction ID or bank reference"
                />
              </Field>
              <label className="flex items-start gap-3 text-sm muted">
                <input className="mt-1" type="checkbox" required /> I have
                transferred the amount using the payment details above. I
                understand the company will verify receipt.
              </label>
              <Button busy={busy}>
                I’ve made the payment <ArrowRight size={16} />
              </Button>
            </form>
          )}
        </PaymentPreview>
      ) : (
        !error && <p className="text-center">Loading payment details…</p>
      )}
      <footer className="public-footer">
        <span>Payment request by {link?.company?.name || "the company"}</span>
        <span>
          Powered by <b>paylink</b> <ExternalLink size={12} />
        </span>
      </footer>
    </main>
  );
}
