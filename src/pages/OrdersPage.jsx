import { useBackendData } from "../hooks/useBackendData";
import { fetchOrders } from "../lib/api";

const OrdersPage = () => {
  const { data, loading, error } = useBackendData(fetchOrders, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Fulfillment
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Orders</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Backend unavailable. No orders to display right now.
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading && !data ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
            Loading orders...
          </div>
        ) : (data || []).length > 0 ? (
          <div className="space-y-3">
            {(data || []).map((order) => (
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
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">
            Orders will appear here as soon as they are placed.
          </div>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;
