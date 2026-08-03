const API_BASE_URL = import.meta.env.VITE_API_URL || "https://np-backend-qnrv.onrender.com";

function getStoredToken() {
  return localStorage.getItem("nuges_admin_token");
}

function normalizePayload(payload) {
  if (payload && typeof payload === "object") {
    if (payload.data !== undefined) return payload.data;
    if (payload.content !== undefined) return payload.content;
    if (payload.payload !== undefined) return payload.payload;
  }

  return payload;
}

async function request(path, options = {}) {
  const token = getStoredToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorPayload = normalizePayload(payload);
    const message =
      (errorPayload && typeof errorPayload === "object" && (errorPayload.message || errorPayload.error)) ||
      (errorPayload && typeof errorPayload === "object" && errorPayload.errors && Object.values(errorPayload.errors).flat().join(", ")) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  const normalized = normalizePayload(payload);

  if (normalized && typeof normalized === "object" && normalized.token) {
    localStorage.setItem("nuges_admin_token", normalized.token);
  }

  return normalized ?? null;
}

export async function loginAdmin(email, password) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchDashboardData() {
  return request("/api/dashboard");
}

export async function fetchProducts() {
  return request("/api/products");
}

export async function createProduct(product) {
  return request("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export async function updateProduct(id, product) {
  return request(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export async function deleteProduct(id) {
  return request(`/api/products/${id}`, {
    method: "DELETE",
  });
}

export async function fetchCustomers() {
  return request("/api/customers");
}

export async function fetchOrders() {
  return request("/api/orders");
}

export async function fetchMessages() {
  return request("/api/messages");
}

export async function checkBackendHealth() {
  return request("/api/health");
}
