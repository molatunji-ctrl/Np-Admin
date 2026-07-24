const products = [
  { name: "Paracetamol 500mg", stock: 24, price: "₦24,800" },
  { name: "Amoxicillin 250mg", stock: 12, price: "₦25,500" },
  { name: "Vitamin C", stock: 35, price: "" },
];

import { Plus } from "lucide-react";
const ProductsView = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Catalog
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Products</h1>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Inventory</h2>
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white flex gap-2">
            <Plus    size={20}/>
            Add Product
          </button>
        </div>

        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.name}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-900">{product.name}</p>
                <p className="text-sm text-slate-500">
                  {product.stock} units in stock
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {product.price}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductsView;
