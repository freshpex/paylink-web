import { useEffect, useState, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { api } from "./lib/api";
import type { User } from "./lib/types";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Checkout } from "./pages/Checkout";
const Receipt = lazy(() =>
  import("./pages/Receipt").then((m) => ({ default: m.Receipt })),
);
import "./styles.css";
import { LanguageSwitcher, LocaleProvider, useI18n } from "./lib/i18n";
function NotFound() {
  const { t } = useI18n();
  return (
    <div className="empty">
      <h1>{t("Page not found")}</h1>
      <a href="/">{t("Go to workspace")}</a>
    </div>
  );
}
function ReceiptLoading() {
  const { t } = useI18n();
  return <div className="loading-screen">{t("Loading receipt…")}</div>;
}
function Workspace() {
  const { t } = useI18n();
  const [user, setUser] = useState<User>(),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    api<User>("/auth/me")
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return loading ? (
    <div className="loading-screen">{t("Opening your workspace…")}</div>
  ) : user ? (
    <Dashboard user={user} onLogout={() => setUser(undefined)} />
  ) : (
    <Auth onLogin={setUser} />
  );
}
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LocaleProvider>
      <LanguageSwitcher />
      <Routes>
      <Route path="/" element={<Workspace />} />
      <Route path="/:locale" element={<Workspace />} />
      <Route path="/pay/:id" element={<Checkout />} />
      <Route path="/:locale/pay/:id" element={<Checkout />} />
      <Route
        path="/receipt/:id"
        element={
          <Suspense
            fallback={<ReceiptLoading />}
          >
            <Receipt />
          </Suspense>
        }
      />
      <Route
        path="/:locale/receipt/:id"
        element={
          <Suspense fallback={<ReceiptLoading />}>
            <Receipt />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={<NotFound />}
      />
      </Routes>
    </LocaleProvider>
  </BrowserRouter>,
);
