import { useState, useEffect, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import Sidebar from "./components/layout/Sidebar";
import { NAV_LABELS } from "./constants/navigation";
import CustomersPage from "./pages/CustomersPage";
import DashboardPage from "./pages/DashboardPage";
import MessagesPage from "./pages/MessagesPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";

const pageComponents = {
  Dashboard: DashboardPage,
  Products: ProductsPage,
  Orders: OrdersPage,
  Customers: CustomersPage,
  Messages: MessagesPage,
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("nuges_admin_token"))
  );
  const [sessionExpired, setSessionExpired] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const handleLogout = useCallback(async () => {
    localStorage.removeItem("nuges_admin_token");
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase sign-out failed:", err);
    }
    setIsAuthenticated(false);
  }, []);

  // Any API call anywhere in the app that gets a 401 (expired/invalid
  // token) dispatches this event. We catch it once, at the top level,
  // and boot the user back to the login screen.
  useEffect(() => {
    const handleUnauthorized = () => {
      setSessionExpired(true);
      handleLogout();
    };

    window.addEventListener("nuges:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("nuges:unauthorized", handleUnauthorized);
  }, [handleLogout]);

  const handleLogin = () => {
    setSessionExpired(false);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} sessionExpired={sessionExpired} />;
  }

  const ActivePage = pageComponents[activePage] || DashboardPage;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar activePage={activePage} onSelect={setActivePage} onLogout={handleLogout} />

        <main className="flex-1 px-5 py-8 md:px-10">
          <div className="mb-6 md:hidden">
            <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
              {NAV_LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActivePage(label)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    label === activePage
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <ActivePage setActivePage={setActivePage} />
        </main>
      </div>
    </div>
  );
};

export default App;