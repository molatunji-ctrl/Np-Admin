import { useEffect, useState } from "react";
import { useBackendData } from "../hooks/useBackendData";
import { fetchOrders, updateOrderStatus } from "../lib/api";

function money(value, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function allowedStatuses(order) {
  if (order.paymentStatus === "PAID") {
    return ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  }
  if (order.paymentStatus === "PENDING") {
    return ["PENDING", "CANCELLED"];
  }
  return [order.status || "CANCELLED"];
}

const OrdersPage = () => {
  const { data, loading, error } = useBackendData(fetchOrders, []);
  const [orders, setOrders] = useState([]);
  const [savingId, setSavingId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => setOrders(data || []), [data]);

  const changeStatus = async (order, status) => {
    if (status === order.status) return;
    setSavingId(order.id);
    setActionError("");
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (statusError) {
      setActionError(statusError.message || "Unable to update this order.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Fulfillment</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Orders</h1>
      </div>

      {(error || actionError) && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {actionError || "Backend unavailable. No orders to display right now."}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading && orders.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => {
              const statuses = allowedStatuses(order);
              return (
                <article key={order.id} className="rounded-2xl border border-slate-200 px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">Order #{order.id}</p>
                      <p className="mt-1 text-sm text-slate-500">{order.customerName || "Customer"} · {order.customerEmail}</p>
                      <p className="mt-1 text-xs text-slate-400">{order.createdAt ? new Date(order.createdAt).toLocaleString("en-NG") : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">{money(order.total, order.currency)}</p>
                      <p className={`mt-1 text-xs font-semibold uppercase tracking-wide ${order.paymentStatus === "PAID" ? "text-emerald-600" : order.paymentStatus === "FAILED" ? "text-rose-600" : "text-amber-600"}`}>
                        Payment: {order.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">{order.items?.length || 0} items</p>
                    <label className="flex items-center gap-2 text-sm text-slate-500">
                      Status
                      <select
                        value={order.status}
                        disabled={savingId === order.id || statuses.length === 1}
                        onChange={(event) => changeStatus(order, event.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800 disabled:opacity-60"
                      >
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-500">Orders will appear here as soon as they are placed.</div>
        )}
      </section>
    </div>
  );
};

export default OrdersPage;
