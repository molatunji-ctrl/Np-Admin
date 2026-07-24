import {
  Home,
  Package,
  ShoppingCart,
  Users,
  MessageCircle,
  ExternalLink,
  LogOut,
} from "lucide-react";

const sidebarNav = [
  { label: "Dashboard", icon: Home },
  { label: "Products", icon: Package },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Messages", icon: MessageCircle },
];

const Sidebar = ({ activePage, onSelect }) => {
  return (
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
          const isActive = item.label === activePage;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.label)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                isActive
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
  );
};

export default Sidebar;
