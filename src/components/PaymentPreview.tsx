import type { PaymentLink, Company } from "../lib/types";
import { money } from "../lib/types";
import { Brand } from "./ui";
export function PaymentPreview({
  link,
  company,
  children,
}: {
  link: Partial<PaymentLink>;
  company: Company;
  children?: React.ReactNode;
}) {
  return (
    <article
      className={`payment-card theme-${link.theme || "classic"}`}
      style={{ "--accent": company.accent } as React.CSSProperties}
    >
      {link.hero_url &&
        (/\.(mp4|webm)(\?|$)/i.test(link.hero_url) ? (
          <video className="payment-hero" src={link.hero_url} controls />
        ) : (
          <img
            className="payment-hero"
            src={link.hero_url}
            alt="Company payment page banner"
          />
        ))}
      <div className="payment-content">
        <Brand name={company.name} logo={company.logo_url} />
        <div className="mt-10">
          <span className="eyebrow">{link.category || "PAYMENT"} PAYMENT</span>
          <h1>{link.title || "Your payment title"}</h1>
          <p className="muted whitespace-pre-wrap">
            {link.description ||
              "A personal payment experience, made for your customer."}
          </p>
        </div>
        <div className="amount-box">
          <span>Total amount</span>
          <strong>{money(link.amount || 0, link.currency || "USD")}</strong>
        </div>
        {link.note && <p className="note whitespace-pre-wrap">{link.note}</p>}
        {children}
      </div>
    </article>
  );
}
