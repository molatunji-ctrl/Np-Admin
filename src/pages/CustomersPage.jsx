import { useBackendData } from "../hooks/useBackendData";
import { fetchCustomers } from "../lib/api";

const CustomersPage = () => {
  const { data, loading, error } = useBackendData(fetchCustomers);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Community
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Customers</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Backend unavailable. Showing cached customer data.
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {loading && !data ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Loading customers...
          </div>
        ) : (
          <div className="space-y-3">
            {(data || []).map((customer) => (
              <div
                key={customer.id || customer.name}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{customer.name}</p>
                  <p className="text-sm text-slate-500">
                    {customer.orders} orders
                  </p>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {customer.spend}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomersPage;
