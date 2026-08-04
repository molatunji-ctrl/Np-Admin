import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://np-backend-qnrv.onrender.com";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getStoredToken() {
  return localStorage.getItem("nuges_admin_token");
}

function authHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Parses a response as JSON safely (handles empty/non-JSON bodies) and
// throws a consistent ApiError on failure. A 401 means the stored token
// is invalid or expired — broadcast that globally so App.jsx can log
// the user out, without every call site needing to know about auth.
async function parseJsonOrThrow(response, fallbackMessage) {
  let data = null;
  try {
    data = await response.json();
  } catch {
    // No JSON body — fine, we'll fall back to fallbackMessage
  }

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent("nuges:unauthorized"));
    }
    throw new ApiError(data?.message || fallbackMessage, response.status);
  }

  return data;
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

export async function logoutAdmin() {
  localStorage.removeItem("nuges_admin_token");
  await signOut(auth);
}

export async function fetchDashboardData() {
  const res = await fetch(`${API_BASE_URL}/api/dashboard`, {
    headers: authHeaders(getStoredToken()),
  });
  return parseJsonOrThrow(res, "Failed to fetch dashboard data");
}

export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/api/products`, {
    headers: authHeaders(getStoredToken()),
  });
  return parseJsonOrThrow(res, "Failed to fetch products");
}

export async function createProduct(product) {
  const res = await fetch(`${API_BASE_URL}/api/products`, {
    method: "POST",
    headers: authHeaders(getStoredToken()),
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
  return parseJsonOrThrow(res, "Failed to create product");
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "PUT",
    headers: authHeaders(getStoredToken()),
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
  return parseJsonOrThrow(res, "Failed to update product");
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(getStoredToken()),
  });
  return parseJsonOrThrow(res, "Failed to delete product");
}

export async function fetchCustomers() {
  const res = await fetch(`${API_BASE_URL}/api/customers`, {
    headers: authHeaders(getStoredToken()),
  });
  return parseJsonOrThrow(res, "Failed to fetch customers");
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: authHeaders(getStoredToken()),
  });
  return parseJsonOrThrow(res, "Failed to fetch orders");
}

export async function fetchMessages() {
  const res = await fetch(`${API_BASE_URL}/api/messages`, {
    headers: authHeaders(getStoredToken()),
  });
  return parseJsonOrThrow(res, "Failed to fetch messages");
}

export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
}