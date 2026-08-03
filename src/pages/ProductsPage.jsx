import { Pencil, Plus, Trash2 } from "lucide-react";
import { useBackendData } from "../hooks/useBackendData";
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "../lib/api";
import { products as fallbackProducts } from "../data/products";
import { useEffect, useState } from "react";

const defaultProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  badge: "",
  image: "",
  featured: false,
  active: true,
};

const normalizeProduct = (product) => {
  const price = Number(product.price ?? 0);
  const stock = Number(product.stock ?? 0);

  return {
    ...product,
    name: product.name?.trim() || "Unnamed product",
    description: product.description?.trim() || "",
    category: product.category?.trim() || "General",
    badge: product.badge?.trim() || "New",
    image: product.image || "",
    price: Number.isNaN(price) ? 0 : price,
    stock: Number.isNaN(stock) ? 0 : stock,
    featured: Boolean(product.featured),
    active: product.active !== false,
  };
};

const ProductsPage = () => {
  const { data, loading, error } = useBackendData(fetchProducts, fallbackProducts);
  const [products, setProducts] = useState(data || fallbackProducts || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProducts(data || fallbackProducts || []);
  }, [data]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (form) => {
    const normalized = normalizeProduct(form);
    setIsSaving(true);

    try {
      if (editingProduct?.id) {
        const updated = await updateProduct(editingProduct.id, normalized);
        setProducts((prev) =>
          prev.map((product) => (Number(product.id) === Number(updated.id) ? updated : product))
        );
      } else {
        const created = await createProduct(normalized);
        setProducts((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (submitError) {
      console.error(submitError);
      window.alert(submitError.message || "Unable to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => Number(product.id) !== Number(id)));
    } catch (deleteError) {
      console.error(deleteError);
      window.alert(deleteError.message || "Unable to delete product.");
    }
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
          <button onClick={openCreateModal} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
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
                  <span className="text-sm font-semibold text-slate-700">
                    {product.price ? `₦${Number(product.price).toLocaleString()}` : "₦0"}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="text-slate-500 hover:text-slate-700"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
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
            <h3 className="text-2xl font-semibold">{editingProduct ? "Edit product" : "New product"}</h3>
            <ProductForm
              initialData={editingProduct ? { ...defaultProductForm, ...editingProduct } : defaultProductForm}
              onCancel={closeModal}
              onSave={handleSaveProduct}
              isSaving={isSaving}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ initialData, onSave, onCancel, isSaving }) => {
  const [form, setForm] = useState({
    ...defaultProductForm,
    ...initialData,
    price: initialData?.price ?? "",
    stock: initialData?.stock ?? "",
  });

  useEffect(() => {
    setForm({
      ...defaultProductForm,
      ...initialData,
      price: initialData?.price ?? "",
      stock: initialData?.stock ?? "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label className="block text-sm text-slate-600">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" required />
      </div>

      <div>
        <label className="block text-sm text-slate-600">Description</label>
        <input name="description" value={form.description} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-600">Price</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" required />
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
        <button type="submit" disabled={isSaving} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70">
          {isSaving ? "Saving..." : "Save product"}
        </button>
      </div>
    </form>
  );
};

export default ProductsPage;
