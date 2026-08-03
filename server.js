import http from "node:http";

const PORT = Number(process.env.PORT || 3001);

const dashboardData = {
  stats: [
    { title: "Total Revenue", value: "₦4,250", subtitle: "Updated from backend", hide: true, iconName: "TrendingUp" },
    { title: "Orders", value: "12", subtitle: "3 pending", hide: false, iconName: "ShoppingCart" },
    { title: "Customers", value: "18", hide: false, iconName: "Users" },
    { title: "Products", value: "9", hide: false, iconName: "Package" },
  ],
  newMessagesCount: 3,
  orders: [
    { id: "ORD-1001", customer: "Amina Yusuf", total: "₦32,500", status: "Packed" },
    { id: "ORD-1002", customer: "Tunde Adebayo", total: "₦18,200", status: "Delivered" },
  ],
};

let products = [
  { id: 1, name: "Paracetamol 500mg", stock: 24, price: 24800, description: "Pain relief and fever support", category: "General", badge: "Popular", image: "", featured: false, active: true },
  { id: 2, name: "Amoxicillin 250mg", stock: 12, price: 25500, description: "Antibiotic treatment", category: "Prescription", badge: "New", image: "", featured: true, active: true },
  { id: 3, name: "Vitamin C", stock: 35, price: 12300, description: "Immune support supplement", category: "Supplements", badge: "Hot", image: "", featured: false, active: true },
];

const customers = [
  { name: "Amina Yusuf", orders: 5, spend: "₦16,450" },
  { name: "Tunde Adebayo", orders: 3, spend: "₦9,200" },
  { name: "Grace Thomas", orders: 6, spend: "₦21,300" },
];

const messages = [
  { id: 1, sender: "Pharmacy team", preview: "Shipment arrived for the new batch.", unread: true },
  { id: 2, sender: "Supplier", preview: "Confirm your restock request before noon.", unread: false },
];

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (pathname === "/api/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (pathname === "/api/dashboard") {
    sendJson(res, 200, dashboardData);
    return;
  }

  if (pathname === "/api/customers") {
    sendJson(res, 200, customers);
    return;
  }

  if (pathname === "/api/orders") {
    sendJson(res, 200, dashboardData.orders);
    return;
  }

  if (pathname === "/api/messages") {
    sendJson(res, 200, messages);
    return;
  }

  if (pathname === "/api/products") {
    if (req.method === "GET") {
      sendJson(res, 200, products);
      return;
    }

    if (req.method === "POST") {
      try {
        const body = await readJsonBody(req);
        const nextProduct = {
          id: Number(body.id) || Date.now(),
          name: body.name || "Unnamed product",
          description: body.description || "",
          price: Number(body.price) || 0,
          stock: Number(body.stock) || 0,
          category: body.category || "General",
          badge: body.badge || "New",
          image: body.image || "",
          featured: Boolean(body.featured),
          active: body.active !== false,
        };

        products = [nextProduct, ...products];
        sendJson(res, 201, nextProduct);
      } catch (error) {
        sendJson(res, 400, { error: error.message || "Unable to create product" });
      }
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (pathname.startsWith("/api/products/")) {
    const productId = Number(pathname.replace("/api/products/", ""));

    if (Number.isNaN(productId)) {
      sendJson(res, 400, { error: "Invalid product id" });
      return;
    }

    if (req.method === "PUT") {
      try {
        const body = await readJsonBody(req);
        const productIndex = products.findIndex((product) => Number(product.id) === productId);

        if (productIndex === -1) {
          sendJson(res, 404, { error: "Product not found" });
          return;
        }

        products[productIndex] = {
          ...products[productIndex],
          ...body,
          id: productId,
          price: Number(body.price) ?? products[productIndex].price,
          stock: Number(body.stock) ?? products[productIndex].stock,
        };

        sendJson(res, 200, products[productIndex]);
      } catch (error) {
        sendJson(res, 400, { error: error.message || "Unable to update product" });
      }
      return;
    }

    if (req.method === "DELETE") {
      const previousLength = products.length;
      products = products.filter((product) => Number(product.id) !== productId);

      if (products.length === previousLength) {
        sendJson(res, 404, { error: "Product not found" });
        return;
      }

      sendJson(res, 200, { success: true, deletedId: productId });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
