import { useEffect, useState, type FormEvent } from "react";
import { Building2, ImagePlus } from "lucide-react";
import { api, send, uploadMedia } from "../lib/api";
import type { Company } from "../lib/types";
import { Alert, Brand, Button, Field } from "../components/ui";
export function CompanySettings({
  company,
  onSaved,
}: {
  company: Company;
  onSaved: (c: Company) => void;
}) {
  const [name, setName] = useState(company.name),
    [accent, setAccent] = useState(company.accent),
    [logo, setLogo] = useState(company.logo_url || ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState(false),
    [adding, setAdding] = useState(false),
    [newName, setNewName] = useState("");
  useEffect(() => {
    setName(company.name);
    setAccent(company.accent);
    setLogo(company.logo_url || "");
    setSaved(false);
  }, [company]);
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const c = await api<Company>(
        adding ? "/companies" : `/companies/${company.id}`,
        send(adding ? "POST" : "PUT", {
          name: adding ? newName : name,
          accent,
          logo_url: logo || null,
        }),
      );
      await onSaved(c);
      setAdding(false);
      setNewName("");
      setSaved(true);
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
          <span className="eyebrow">A BRAND THEY RECOGNIZE</span>
          <h1>Company settings</h1>
          <p>The details that make your payment page feel like you.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setAdding(!adding);
            setLogo("");
            setAccent("#4f46e5");
            setSaved(false);
          }}
        >
          <Building2 size={16} />
          {adding ? "Cancel new company" : "Add another company"}
        </Button>
      </div>
      <form onSubmit={save} className="data-panel settings-form form-stack">
        {error && <Alert>{error}</Alert>}
        {saved && (
          <p role="status" className="success-note">
            Company saved successfully.
          </p>
        )}
        <h3>{adding ? "New company" : "Your brand"}</h3>
        <Field label="Company name">
          <input
            required
            maxLength={120}
            value={adding ? newName : name}
            onChange={(e) =>
              adding ? setNewName(e.target.value) : setName(e.target.value)
            }
          />
        </Field>
        <div className="brand-setting">
          <Brand name={(adding ? newName : name) || "Company"} logo={logo} />
          <label className="upload-label">
            <ImagePlus size={16} /> Upload logo
            <input
              className="sr-only"
              type="file"
              disabled={busy}
              accept="image/png,image/jpeg,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  setLogo(await uploadMedia(company.id, file));
                } catch (e) {
                  setError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
        </div>
        {logo && (
          <button
            type="button"
            className="text-button"
            onClick={() => setLogo("")}
          >
            Remove logo
          </button>
        )}
        <Field label="Brand color">
          <div className="flex gap-3 items-center">
            <input
              className="color-input"
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
            <span className="muted">{accent}</span>
          </div>
        </Field>
        <p className="muted text-sm">
          Branding is used on payment pages. Confirmed receipts keep a snapshot
          of the brand and payment details at the time of approval.
        </p>
        <Button busy={busy}>Save company</Button>
      </form>
    </>
  );
}
