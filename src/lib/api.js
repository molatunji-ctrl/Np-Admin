import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://np-backend-qnrv.onrender.com";

function getStoredToken() {
  return localStorage.getItem("nuges_admin_token");
}

export async function loginAdmin(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();

  localStorage.setItem("nuges_admin_token", token);

  return {
    token,
    user: {
      email: userCredential.user.email,
      uid: userCredential.user.uid,
    },
  };
}

export async function fetchDashboardData() {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch dashboard data");
  }

  return res.json();
}

export async function fetchProducts() {
  const token = localStorage.getItem("nuges_admin_token");

  const response = await fetch("https://np-backend-qnrv.onrender.com/api/products", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const products = await response.json();

  if (!response.ok) {
    throw new Error(products.message || "Failed to fetch products");
  }

  return products;
}

export async function createProduct(product) {
  const token = localStorage.getItem("nuges_admin_token");

  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      badge: product.badge,
      image: product.image || "",
      featured: Boolean(product.featured),
      active: Boolean(product.active),
    }),
  });

  const created = await response.json();

  if (!response.ok) {
    throw new Error(created.message || "Failed to create product");
  }

  return created;
}

export async function updateProduct(id, product) {
  const token = localStorage.getItem("nuges_admin_token");

  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      badge: product.badge,
      image: product.image || "",
      featured: Boolean(product.featured),
      active: Boolean(product.active),
    }),
  });

  const updated = await response.json();

  if (!response.ok) {
    throw new Error(updated.message || "Failed to update product");
  }

  return updated;
}

export async function deleteProduct(id) {
  const token = localStorage.getItem("nuges_admin_token");

  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
}

export async function fetchCustomers() {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE_URL}/api/customers`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch customers");
  }

  return res.json();
}

export async function fetchOrders() {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch orders");
  }

  return res.json();
}

export async function fetchMessages() {
  const token = getStoredToken();
  const res = await fetch(`${API_BASE_URL}/api/messages`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to fetch messages");
  }

  return res.json();
}

export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
}
