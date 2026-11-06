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
function Workspace() {
  const [user, setUser] = useState<User>(),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    api<User>("/auth/me")
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return loading ? (
    <div className="loading-screen">Opening your workspace…</div>
  ) : user ? (
    <Dashboard user={user} onLogout={() => setUser(undefined)} />
  ) : (
    <Auth onLogin={setUser} />
  );
}
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Workspace />} />
      <Route path="/pay/:id" element={<Checkout />} />
      <Route
        path="/receipt/:id"
        element={
          <Suspense
            fallback={<div className="loading-screen">Loading receipt…</div>}
          >
            <Receipt />
          </Suspense>
        }
      />
      <Route
        path="*"
        element={
          <div className="empty">
            <h1>Page not found</h1>
            <a href="/">Go to workspace</a>
          </div>
        }
      />
    </Routes>
  </BrowserRouter>,
);
