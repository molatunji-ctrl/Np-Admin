import { useState } from "react";
import Sidebar from "./components/Sidebar";
import CustomersView from "./views/CustomersView";
import DashboardView from "./views/DashboardView";
import MessagesView from "./views/MessagesView";
import OrdersView from "./views/OrdersView";
import ProductsView from "./views/ProductsView";

const pageComponents = {
  Dashboard: DashboardView,
  Products: ProductsView,
  Orders: OrdersView,
  Customers: CustomersView,
  Messages: MessagesView,
};

const mobileTabs = ["Dashboard", "Products", "Orders", "Customers", "Messages"];

const App = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const ActiveView = pageComponents[activePage] || DashboardView;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar activePage={activePage} onSelect={setActivePage} />

        <main className="flex-1 px-5 py-8 md:px-10">
          <div className="mb-6 md:hidden">
            <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
              {mobileTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActivePage(tab)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    tab === activePage
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <ActiveView />
        </main>
      </div>
    </div>
  );
};

export default App;
