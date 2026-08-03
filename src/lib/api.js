const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://np-backend-qnrv.onrender.com";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && payload.message) ||
      (payload && typeof payload === "object" && payload.error) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload || null;
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
