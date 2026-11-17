import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Link2,
  Plus,
  ArrowUpRight,
  LayoutDashboard,
  Settings2,
  LogOut,
  Wallet,
  CheckCircle2,
  Clock3,
  ArrowRight,
  Menu,
} from "lucide-react";
import { api, send } from "../lib/api";
import {
  money,
  type Company,
  type User,
  type PaymentLink,
  type Payment,
} from "../lib/types";
import { Alert, Button, CopyButton, Empty, Status } from "../components/ui";
import { LinkEditor } from "./LinkEditor";
import { CompanySettings } from "./CompanySettings";
import { localizedPath, useI18n } from "../lib/i18n";
type Tab = "overview" | "links" | "payments" | "settings" | "create";
export function Dashboard({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const { t, locale } = useI18n();
  const [companies, setCompanies] = useState<Company[]>([]),
    [cid, setCid] = useState(""),
    [tab, setTab] = useState<Tab>("overview"),
    [links, setLinks] = useState<PaymentLink[]>([]),
    [payments, setPayments] = useState<Payment[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [mobile, setMobile] = useState(false),
    [reviewing, setReviewing] = useState<Payment>(),
    [busy, setBusy] = useState(false);
  const currentCid = useRef(cid);
  currentCid.current = cid;
  const company = companies.find((c) => c.id === cid);
  async function loadCompanies() {
    const c = await api<Company[]>("/companies");
    setCompanies(c);
    setCid((prev) => prev || c[0]?.id || "");
  }
  useEffect(() => {
    loadCompanies().catch((e) => setError(e.message));
  }, []);
  async function refresh() {
    if (!cid) return;
    setLoading(true);
    try {
      const [l, p] = await Promise.all([
        api<PaymentLink[]>(`/companies/${cid}/links`),
        api<Payment[]>(`/companies/${cid}/payments`),
      ]);
      if (currentCid.current !== cid) return;
      setLinks(l);
      setPayments(p);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      if (currentCid.current === cid) setLoading(false);
    }
  }
  useEffect(() => {
    setLinks([]);
    setPayments([]);
    refresh();
  }, [cid]);
  function navigate(t: Tab) {
    setTab(t);
    setMobile(false);
    setError("");
  }
  async function review(decision: "paid" | "rejected") {
    if (!reviewing) return;
    setBusy(true);
    try {
      await api(
        `/companies/${cid}/payments/${reviewing.id}/review`,
        send("POST", { decision }),
      );
      setReviewing(undefined);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const pending = payments.filter((p) => p.status === "pending");
  const totals = payments
    .filter((p) => p.status === "paid")
    .reduce(
      (acc, p) => {
        acc[p.currency] = (acc[p.currency] || 0) + p.amount;
        return acc;
      },
      {} as Record<string, number>,
    );
  const displayLinks = tab === "overview" ? links.slice(0, 5) : links;
  return (
    <div className="app-layout">
      <button
        className="mobile-menu"
        aria-label={t("Toggle navigation")}
        onClick={() => setMobile(!mobile)}
      >
        <Menu />
      </button>
      <aside className={`sidebar ${mobile ? "is-open" : ""}`}>
        <div className="wordmark">
          <span className="brand-mark">
            <Link2 size={21} />
          </span>
          paylink<span className="tiny-tag">{t("BUSINESS")}</span>
        </div>
        <div className="workspace-select">
          <small>{t("YOUR WORKSPACE")}</small>
          <select
            aria-label={t("Select company")}
            value={cid}
            onChange={(e) => {
              setReviewing(undefined);
              setCid(e.target.value);
              setTab("overview");
            }}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <nav>
          {(
            [
              ["overview", LayoutDashboard, t("Overview")],
              ["links", Link2, t("Payment links")],
              ["payments", Wallet, t("Payments")],
              ["settings", Settings2, t("Company settings")],
            ] as const
          ).map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => navigate(key)}
              className={tab === key ? "active" : ""}
            >
              <Icon size={18} />
              {label}
              {key === "payments" && pending.length > 0 && (
                <span className="nav-count">{pending.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-tip">
          <span className="little-star">✧</span>
          <strong>{t("A link that looks like you.")}</strong>
          <p>{t("Add your logo and colors to make every payment feel personal.")}</p>
          <button onClick={() => navigate("settings")}>
            {t("Make it yours")} <ArrowRight size={14} />
          </button>
        </div>
        <div className="sidebar-user">
          <span className="avatar">{user.name.slice(0, 1)}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <button
            aria-label={t("Sign out")}
            onClick={async () => {
              await api("/auth/logout", send("POST", {}));
              onLogout();
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <span>
            {t("Workspace")} <span className="mx-3 text-slate-300">/</span>
            <b>{company?.name}</b>
          </span>
          <span className="topbar-right">
            <span className="live-dot" /> {t("Your business, connected")}
          </span>
        </header>
        <main className="dashboard-main">
          {error && <Alert>{error}</Alert>}
          {company && tab === "create" ? (
            <LinkEditor
              company={company}
              onCancel={() => navigate("links")}
              onCreated={async () => {
                await refresh();
                navigate("links");
              }}
            />
          ) : company && tab === "settings" ? (
            <CompanySettings
              company={company}
              onSaved={async (c) => {
                await loadCompanies();
                setCid(c.id);
              }}
            />
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">
                    {tab === "overview"
                      ? t("YOUR BUSINESS AT A GLANCE")
                      : t("YOUR WORKSPACE")}
                  </span>
                  <h1>
                    {tab === "overview"
                      ? `${t("Good to see you,")} ${user.name.split(" ")[0]}.`
                      : tab === "links"
                        ? t("Payment links")
                        : t("Payments")}
                  </h1>
                  <p>
                    {tab === "overview"
                      ? t("A little less chasing. A lot more getting paid.")
                      : tab === "links"
                        ? t("Thoughtful payment experiences, one link at a time.")
                        : t("Review reports and confirm funds in your own account.")}
                  </p>
                </div>
                <Button onClick={() => navigate("create")}>
                  <Plus size={17} /> {t("Create payment link")}
                </Button>
              </div>
              {tab === "overview" && (
                <>
                  <div className="welcome-banner">
                    <div>
                      <span className="eyebrow">{t("LOOK GOOD. GET PAID.")}</span>
                      <h2>{t("One link. Your whole brand.")}</h2>
                      <p>
                        {t("Make your next payment request feel like a personal invitation.")}
                      </p>
                      <button onClick={() => navigate("create")}>
                        {t("Create your first link")} <ArrowUpRight size={16} />
                      </button>
                    </div>
                    <div className="banner-art">
                      <div className="art-orbit" />
                      <div className="mini-link">
                        <Link2 size={24} />
                        <span>{t("Made for your business")}</span>
                        <b>
                          {t("Ready to share")} <ArrowUpRight size={15} />
                        </b>
                      </div>
                      <div className="art-chip">
                        <CheckCircle2 size={17} /> {t("Beautifully simple")}
                      </div>
                    </div>
                  </div>
                  <div className="stats-grid">
                    <div>
                      <span>
                        <Wallet size={17} /> {t("Confirmed payments")}
                      </span>
                      <h2>
                        {Object.entries(totals).map(([cur, n]) => (
                          <span className="block" key={cur}>
                            {money(n, cur)}
                          </span>
                        ))}
                        {!Object.keys(totals).length && "—"}
                      </h2>
                      <small>
                        {t("Company-confirmed funds · latest 200 reports")}
                      </small>
                    </div>
                    <div>
                      <span>
                        <Clock3 size={17} /> {t("Awaiting review")}
                      </span>
                      <h2>{pending.length}</h2>
                      <small>{t("Payment reports to check")}</small>
                    </div>
                    <div>
                      <span>
                        <Link2 size={17} /> {t("Active payment links")}
                      </span>
                      <h2>{links.filter((l) => l.active).length}</h2>
                      <small>{t("Ready for your customers · latest 200 links")}</small>
                    </div>
                  </div>
                </>
              )}
              {(tab === "overview" || tab === "links") && (
                <section className="data-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>
                        {tab === "overview"
                          ? t("Your latest payment links")
                          : t("All payment links")}
                      </h3>
                      <p>{t("Ready when your customers are.")}</p>
                    </div>
                    {tab === "overview" && (
                      <button
                        className="text-button"
                        onClick={() => navigate("links")}
                      >
                        {t("View all links")} <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                  {loading ? (
                    <p className="p-8 muted">{t("Loading links…")}</p>
                  ) : !links.length ? (
                    <Empty title={t("Your first link starts here")}>
                      {t("Create a branded payment request and share it with anyone.")}
                    </Empty>
                  ) : (
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>{t("Payment link")}</th>
                            <th>{t("Amount")}</th>
                            <th>{t("Status")}</th>
                            <th>{t("Created")}</th>
                            <th>
                              <span className="sr-only">{t("Actions")}</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayLinks.map((l) => (
                            <tr key={l.id}>
                              <td>
                                <Link
                                  className="row-title"
                                  to={localizedPath(`/pay/${l.id}`, locale)}
                                  target="_blank"
                                >
                                  {l.title}
                                  <ArrowUpRight size={14} />
                                </Link>
                                <small>{l.category}</small>
                              </td>
                              <td className="font-semibold">
                                {money(l.amount, l.currency)}
                              </td>
                              <td>
                                <Status
                                  status={l.active ? "active" : "inactive"}
                                />
                              </td>
                              <td>
                                {new Date(l.created_at).toLocaleDateString()}
                              </td>
                              <td>
                                <div className="flex gap-2 items-center">
                                  <CopyButton
                                    value={`${location.origin}${localizedPath(`/pay/${l.id}`, locale)}`}
                                  />
                                  <button
                                    className="text-button"
                                    onClick={async () => {
                                      try {
                                        await api(
                                          `/companies/${cid}/links/${l.id}`,
                                          send("PATCH", { active: !l.active }),
                                        );
                                        refresh();
                                      } catch (e) {
                                        setError((e as Error).message);
                                      }
                                    }}
                                  >
                                    {l.active ? t("Pause") : t("Activate")}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}
              {tab === "payments" && (
                <section className="data-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>{t("Payment reports")}</h3>
                      <p>
                        {t("Confirm only after checking that funds arrived in your account.")}
                      </p>
                    </div>
                    <Button variant="secondary" onClick={refresh}>
                      {t("Refresh")}
                    </Button>
                  </div>
                  {!payments.length ? (
                    <Empty title={t("Nothing to review just yet")}>
                      {t("Customer payment reports will appear here.")}
                    </Empty>
                  ) : (
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>{t("Customer")}</th>
                            <th>{t("Amount")}</th>
                            <th>{t("Method")}</th>
                            <th>{t("Status")}</th>
                            <th>{t("Action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((p) => (
                            <tr key={p.id}>
                              <td>
                                <strong>{p.name}</strong>
                                <small>{p.email}</small>
                              </td>
                              <td>{money(p.amount, p.currency)}</td>
                              <td>{p.provider}</td>
                              <td>
                                <Status status={p.status} />
                              </td>
                              <td>
                                {p.status === "pending" ? (
                                  <Button
                                    variant="secondary"
                                    onClick={() => setReviewing(p)}
                                  >
                                    {t("Review")}
                                  </Button>
                                ) : p.status === "paid" ? (
                                  <Link
                                    className="text-button"
                                    to={localizedPath(`/receipt/${p.id}`, locale)}
                                    target="_blank"
                                  >
                                    {t("Receipt")} <ArrowUpRight size={14} />
                                  </Link>
                                ) : (
                                  "—"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )}
              <footer className="dashboard-footer">
                <span>{t("Good business starts with a little trust.")}</span>
                <span>{t("Made personal with paylink")}</span>
              </footer>
            </>
          )}
          {reviewing && (
            <div className="modal-backdrop">
              <section
                role="dialog"
                aria-modal="true"
                aria-label={t("Review payment")}
                className="modal"
              >
                <span className="eyebrow">{t("PAYMENT REVIEW")}</span>
                <h2>{t("Have the funds arrived?")}</h2>
                <p>
                  {t("Check your bank, wallet, or payment account before confirming. This creates the customer’s official receipt.")}
                </p>
                <dl className="review-details">
                  <dt>{t("Customer")}</dt>
                  <dd>
                    {reviewing.name} · {reviewing.email}
                  </dd>
                  <dt>{t("Amount")}</dt>
                  <dd>{money(reviewing.amount, reviewing.currency)}</dd>
                  <dt>{t("Method")}</dt>
                  <dd>{reviewing.provider}</dd>
                  <dt>{t("Transfer reference")}</dt>
                  <dd>{reviewing.transfer_reference || t("Not supplied")}</dd>
                </dl>
                {error && <Alert>{error}</Alert>}
                <div className="flex flex-wrap gap-2">
                  <Button busy={busy} onClick={() => review("paid")}>
                    {t("Confirm funds received")}
                  </Button>
                  <Button
                    busy={busy}
                    variant="danger"
                    onClick={() => review("rejected")}
                  >
                    {t("Reject report")}
                  </Button>
                  <Button
                    disabled={busy}
                    variant="secondary"
                    onClick={() => setReviewing(undefined)}
                  >
                    {t("Cancel")}
                  </Button>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
