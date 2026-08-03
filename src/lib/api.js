const API_BASE_URL = import.meta.env.VITE_API_URL || "https://np-backend-qnrv.onrender.com";

const loginPaths = [
  "/api/admin/login",
  "/api/auth/login",
  "/api/login",
];

const productPaths = [
  "/api/products",
  "/api/product",
];

function getStoredToken() {
  return localStorage.getItem("nuges_admin_token");
}

function normalizePayload(payload) {
  if (payload && typeof payload === "object") {
    if (payload.data !== undefined) return payload.data;
    if (payload.content !== undefined) return payload.content;
    if (payload.payload !== undefined) return payload.payload;
    if (payload.result !== undefined) return payload.result;
  }

  return payload;
}

async function readResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!contentType || isJson) {
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return response.text();
}

async function request(path, options = {}, fallbackPaths = []) {
  const token = getStoredToken();
  const attempts = [path, ...fallbackPaths];
  let lastError = null;

  for (const endpoint of attempts) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
        ...options,
      });

      const payload = await readResponseBody(response);

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
    } catch (error) {
      lastError = error;
      if (endpoint !== attempts[attempts.length - 1]) {
        continue;
      }
    }
  }

  throw lastError || new Error("Request failed");
}

export async function loginAdmin(email, password) {
  const payload = { email, password };
  let lastError = null;

  for (const endpoint of loginPaths) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await readResponseBody(response);

      if (!response.ok) {
        const errorPayload = normalizePayload(body);
        const message =
          (errorPayload && typeof errorPayload === "object" && (errorPayload.message || errorPayload.error)) ||
          `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      const normalized = normalizePayload(body);
      if (normalized && typeof normalized === "object" && normalized.token) {
        localStorage.setItem("nuges_admin_token", normalized.token);
      }

      return normalized ?? { success: true };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to reach the backend. Check the API URL and ensure the server is running with CORS enabled.");
}

export async function fetchDashboardData() {
  return request("/api/dashboard", {}, ["/api/dashboard/stats"]);
}

export async function fetchProducts() {
  return request("/api/products", {}, productPaths);
}

export async function createProduct(product) {
  return request("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  }, productPaths);
}

export async function updateProduct(id, product) {
  return request(`/api/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product),
  }, productPaths.map((path) => `${path}/${id}`));
}

export async function deleteProduct(id) {
  return request(`/api/products/${id}`, {
    method: "DELETE",
  }, productPaths.map((path) => `${path}/${id}`));
}

export async function fetchCustomers() {
  return request("/api/customers", {}, ["/api/customer"]);
}

export async function fetchOrders() {
  return request("/api/orders", {}, ["/api/order"]);
}

export async function fetchMessages() {
  return request("/api/messages", {}, ["/api/message"]);
}

export async function checkBackendHealth() {
  return request("/api/health", {}, ["/actuator/health"]);
}
