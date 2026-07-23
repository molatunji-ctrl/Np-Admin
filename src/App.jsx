import {
  Home,
  Package,
  ShoppingCart,
  Users,
  MessageCircle,
  TrendingUp,
  LogOut,
  ExternalLink,
} from "lucide-react";

const sidebarNav = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Products", icon: Package },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Messages", icon: MessageCircle },
];

const stats = [
  {
    title: "Total Revenue",
    value: "₦0",
    icon: TrendingUp,
  },
  {
    title: "Orders",
    value: "0",
    subtitle: "0 pending",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    value: "8",
    icon: Users,
  },
  {
    title: "Products",
    value: "0",
    icon: Package,
  },
];

const App = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-6 py-8 md:flex md:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
              N
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Nuges Admin
              </p>

              <p className="text-xs text-slate-500">Control Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarNav.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                    item.active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              <ExternalLink size={20} />
              View Site
            </button>

            <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}

        <main className="flex-1 px-5 py-8 md:px-10">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Overview of your pharmacy
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Dashboard
            </h1>
          </div>

          {/* Stats */}

          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {stat.title}
                    </p>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                      <Icon size={20} className="text-slate-700" />
                    </div>
                  </div>

                  <h2 className="text-4xl font-bold text-slate-900">
                    {stat.value}
                  </h2>

                  {stat.subtitle && (
                    <p className="mt-2 text-sm text-slate-500">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Messages */}

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  New Messages
                </p>

                <h2 className="mt-2 text-3xl font-bold">0</h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                <MessageCircle size={20} className="text-slate-700" />
              </div>
            </div>
          </section>

          {/* Recent Orders */}

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Orders</h2>

              <button className="text-sm font-medium text-slate-700 hover:text-slate-900">
                View All
              </button>
            </div>

            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
              No orders yet.
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
