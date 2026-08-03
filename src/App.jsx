import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import { NAV_LABELS } from "./constants/navigation";
import CustomersPage from "./pages/CustomersPage";
import DashboardPage from "./pages/DashboardPage";
import MessagesPage from "./pages/MessagesPage";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage"; // Make sure this path is correct

// Notice we removed 'Login' from the pageComponents mapping 
// because it is no longer a standard sidebar page.
const pageComponents = {
  Dashboard: DashboardPage,
  Products: ProductsPage,
  Orders: OrdersPage,
  Customers: CustomersPage,
  Messages: MessagesPage,
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem("nuges_admin_token")));
  const [activePage, setActivePage] = useState("Dashboard");

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("nuges_admin_token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 3. Render the active page dynamically if they ARE authenticated
  const ActivePage = pageComponents[activePage] || DashboardPage;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Pass down a logout function to the Sidebar if needed */}
        <Sidebar 
          activePage={activePage} 
          onSelect={setActivePage} 
          onLogout={handleLogout} 
        />

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

          {/* Render the selected component */}
          <ActivePage setActivePage={setActivePage} />
        </main>
      </div>
    </div>
  );
};

export default App;