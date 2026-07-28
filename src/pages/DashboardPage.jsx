import { useMemo, useState } from "react";
import { Eye, EyeClosed, MessageCircle, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { useBackendData } from "../hooks/useBackendData";
import { fetchDashboardData } from "../lib/api";
import { dashboardStats as fallbackStats, newMessagesIcon, newMessagesCount as fallbackMessagesCount } from "../data/stats";

const iconMap = {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  MessageCircle,
};

const NewMessagesIcon = newMessagesIcon;

const DashboardPage = ({ setActivePage }) => {
  const [hideStats, setHideStats] = useState(false);
  const { data, loading, error } = useBackendData(fetchDashboardData, {
    stats: fallbackStats,
    newMessagesCount: fallbackMessagesCount,
    orders: [],
  });

  const dashboardStats = useMemo(() => {
    return (data?.stats || fallbackStats).map((stat) => ({
      ...stat,
      icon: iconMap[stat.iconName] || iconMap.TrendingUp,
    }));
  }, [data]);

  return (
    <>
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Overview of your pharmacy
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Backend unavailable. Showing cached data.
        </div>
      )}

      <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
        {loading && !data?.stats ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading summary data...
          </div>
        ) : (
          dashboardStats.map((stat) => {
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

                <h2 className="flex gap-5 text-3xl font-bold text-slate-900">
                  {hideStats && stat.hide ? "****" : stat.value}

                  {stat.hide && (
                    <button
                      type="button"
                      className="cursor-pointer self-center"
                      onClick={() => setHideStats(!hideStats)}
                      aria-label={hideStats ? "Show value" : "Hide value"}
                    >
                      {hideStats ? <Eye /> : <EyeClosed />}
                    </button>
                  )}
                </h2>

                {stat.subtitle && (
                  <p className="mt-2 text-sm text-slate-500">{stat.subtitle}</p>
                )}
              </div>
            );
          })
        )}
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              New Messages
            </p>

            <h2 className="mt-2 text-3xl font-bold">{data?.newMessagesCount ?? fallbackMessagesCount}</h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
            <NewMessagesIcon size={20} className="text-slate-700" />
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Orders</h2>

          <button
            onClick={() => setActivePage && setActivePage("Orders")}
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {(data?.orders || []).length > 0 ? (
            (data?.orders || []).map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-900">{order.id}</p>
                  <p className="text-sm text-slate-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">{order.total}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{order.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
              No orders yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DashboardPage;
