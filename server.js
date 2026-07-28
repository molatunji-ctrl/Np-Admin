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

const products = [
  { name: "Paracetamol 500mg", stock: 24, price: "₦24,800" },
  { name: "Amoxicillin 250mg", stock: 12, price: "₦25,500" },
  { name: "Vitamin C", stock: 35, price: "₦12,300" },
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

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname === "/api/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (pathname === "/api/dashboard") {
    res.writeHead(200);
    res.end(JSON.stringify(dashboardData));
    return;
  }

  if (pathname === "/api/products") {
    res.writeHead(200);
    res.end(JSON.stringify(products));
    return;
  }

  if (pathname === "/api/customers") {
    res.writeHead(200);
    res.end(JSON.stringify(customers));
    return;
  }

  if (pathname === "/api/orders") {
    res.writeHead(200);
    res.end(JSON.stringify(dashboardData.orders));
    return;
  }

  if (pathname === "/api/messages") {
    res.writeHead(200);
    res.end(JSON.stringify(messages));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
