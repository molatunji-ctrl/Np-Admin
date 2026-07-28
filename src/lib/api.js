const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchDashboardData() {
  return request("/api/dashboard");
}

export async function fetchProducts() {
  return request("/api/products");
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
