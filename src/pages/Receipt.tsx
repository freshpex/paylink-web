import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, FileImage, CheckCircle2 } from "lucide-react";
import { api } from "../lib/api";
import { money, type Receipt as ReceiptData } from "../lib/types";
import { Alert, Brand, Button } from "../components/ui";
import { useI18n } from "../lib/i18n";
export function Receipt() {
  const { t } = useI18n();
  const { id } = useParams();
  const [data, setData] = useState<ReceiptData>(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    api<ReceiptData>(`/public/receipts/${id}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [id]);
  async function download(pdf: boolean) {
    if (!ref.current) return;
    setBusy(true);
    setError("");
    try {
      const { toPng } = await import("html-to-image");
      const png = await toPng(ref.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });
      if (pdf) {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({
          unit: "px",
          format: [ref.current.offsetWidth, ref.current.offsetHeight],
          hotfixes: ["px_scaling"],
        });
        doc.addImage(
          png,
          "PNG",
          0,
          0,
          ref.current.offsetWidth,
          ref.current.offsetHeight,
          undefined,
          "FAST",
        );
        doc.save(`receipt-${id}.pdf`);
      } else {
        const a = document.createElement("a");
        a.href = png;
        a.download = `receipt-${id}.png`;
        a.click();
      }
    } catch {
      setError(t("Could not export the receipt. Please try again."));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="receipt-shell">
      {error && <Alert>{error}</Alert>}
      {data ? (
        <>
          <div className="receipt-toolbar">
            <div>
              <span className="eyebrow">{t("YOURS TO KEEP")}</span>
              <h2>{t("A little proof. A lot of peace of mind.")}</h2>
            </div>
            <div className="flex gap-2">
              <Button
                busy={busy}
                variant="secondary"
                onClick={() => download(false)}
              >
                <FileImage size={16} /> {t("Image")}
              </Button>
              <Button busy={busy} onClick={() => download(true)}>
                <Download size={16} /> {t("PDF")}
              </Button>
            </div>
          </div>
          <div
            ref={ref}
            className={`receipt theme-${data.theme}`}
            style={{ "--accent": data.accent } as React.CSSProperties}
          >
            <div className="receipt-top">
              <Brand name={data.company} logo={data.logo_url} />
              <span className="receipt-confirmed">
                <CheckCircle2 size={15} /> {t("Confirmed by company")}
              </span>
            </div>
            <span className="eyebrow mt-12 block">{data.heading}</span>
            <h1>{money(data.amount, data.currency)}</h1>
            <p className="muted">{data.title}</p>
            <hr />
            <div className="receipt-grid">
              <div>
                <small>{t("RECEIVED FROM")}</small>
                <strong>{data.payer}</strong>
                <span>{data.email}</span>
              </div>
              <div>
                <small>{t("PAYMENT METHOD")}</small>
                <strong>{data.method}</strong>
              </div>
              <div>
                <small>{t("CONFIRMED ON")}</small>
                <strong>{new Date(data.confirmed_at).toLocaleString()}</strong>
              </div>
              <div>
                <small>{t("TRANSFER REFERENCE")}</small>
                <strong>{data.reference || t("Not supplied")}</strong>
              </div>
            </div>
            <div className="receipt-id">
              <small>{t("RECEIPT NUMBER")}</small>
              <p>{data.id}</p>
            </div>
            <p className="whitespace-pre-wrap receipt-footer">{data.footer}</p>
            <small className="muted">
              {t("Issued by")} {data.company} {t("following confirmation of funds.")}
            </small>
          </div>
        </>
      ) : (
        !error && <p>{t("Loading receipt…")}</p>
      )}
    </main>
  );
}
