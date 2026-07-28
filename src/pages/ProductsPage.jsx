import { Plus, Trash2 } from "lucide-react";
import { useBackendData } from "../hooks/useBackendData";
import { fetchProducts } from "../lib/api";
import { products as fallbackProducts } from "../data/products";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const { data, loading, error } = useBackendData(fetchProducts, fallbackProducts);
  const [products, setProducts] = useState(data || fallbackProducts || []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setProducts(data || fallbackProducts || []);
  }, [data]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addProduct = (newProduct) => {
    setProducts((prev) => [{ ...newProduct, id: Date.now() }, ...prev]);
    closeModal();
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
          Catalog
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Products</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Backend unavailable. Showing cached product data.
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Inventory</h2>
          <button onClick={openModal} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {loading && !products ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Loading products...
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id || product.name}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500">
                    {product.stock} units in stock
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">{product.price}</span>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="text-slate-500 hover:text-red-600"
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="text-2xl font-semibold">New product</h3>
            <ProductForm onCancel={closeModal} onSave={addProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    badge: "",
    image: "",
    featured: false,
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm text-slate-600">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm text-slate-600">Description</label>
        <input name="description" value={form.description} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-600">Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-600">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Badge</label>
          <input name="badge" value={form.badge} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-600">Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
          Active
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="rounded-md px-4 py-2 text-sm">Cancel</button>
        <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Save product</button>
      </div>
    </form>
  );
};

export default ProductsPage;
