import {
  MessageCircle,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₦0",
    icon: TrendingUp,
    hide: true,
  },
  {
    title: "Orders",
    value: "0",
    subtitle: "0 pending",
    icon: ShoppingCart,
    hide: false,
  },
  {
    title: "Customers",
    value: "8",
    icon: Users,
    hide: false,
  },
  {
    title: "Products",
    value: "0",
    icon: Package,
    hide: false,
  },
];

const DashboardView = () => {
  return (
    <>
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Overview of your pharmacy
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">Dashboard</h1>
      </div>

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

              <h2 className="text-4xl font-bold text-slate-900 flex gap-5">
                {stat.value}

                <button
                  className={`cursor-pointer self-center items-end ${stat.hide == false ? "hidden" : "bg-white"}`}
                >
                  <Eye />
                </button>
              </h2>

              {stat.subtitle && (
                <p className="mt-2 text-sm text-slate-500">{stat.subtitle}</p>
              )}
            </div>
          );
        })}
      </div>

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
    </>
  );
};

export default DashboardView;
