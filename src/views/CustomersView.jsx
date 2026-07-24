const customers = [
  { name: "Amina Yusuf", orders: 5, spend: "₦16,450" },
  { name: "Tunde Adebayo", orders: 3, spend: "₦9,200" },
  { name: "Grace Thomas", orders: 6, spend: "₦21,300" },
];

const CustomersView = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Community
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Customers</h1>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.name}
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
      </section>
    </div>
  );
};

export default CustomersView;
