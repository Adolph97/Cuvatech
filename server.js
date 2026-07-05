// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { IncomingForm } from "formidable";
dotenv.config();
var app = express();
var PORT = process.env.PORT || 3001;
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
app.use(express.json({ limit: "50mb" }));
var DB_FILE = path.join(__dirname, "orders.json");
var CONFIG_FILE = path.join(__dirname, "config.json");
var UPLOADS_DIR = path.join(__dirname, "uploads");
var PRODUCTS_FILE = path.join(__dirname, "products.json");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
var readConfig = () => {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      const defaultConfig = {
        username: "admin",
        password: "password",
        stripePublishableKey: "",
        stripeSecretKey: "",
        paypalClientId: "",
        canvaApiKey: "",
        paymentMode: "sandbox",
        // Delivery fee settings
        deliveryFee: 35,
        premiumDeliveryFee: 45,
        minOrderWeightKg: 10,
        premiumClients: ["Jastel Water", "Surjen Healthcare"]
      };
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    }
    const data = fs.readFileSync(CONFIG_FILE, "utf8");
    const config = JSON.parse(data);
    if (!config.deliveryFee) config.deliveryFee = 35;
    if (!config.premiumDeliveryFee) config.premiumDeliveryFee = 45;
    if (!config.minOrderWeightKg) config.minOrderWeightKg = 10;
    if (!config.premiumClients) config.premiumClients = ["Jastel Water", "Surjen Healthcare"];
    return config;
  } catch (err) {
    console.error("Error reading config file:", err);
    return { username: "admin", password: "password" };
  }
};
var writeConfig = (config) => {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (err) {
    console.error("Error writing config file:", err);
  }
};
var readOrders = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = [
        {
          id: "ORD-7721",
          type: "IT",
          customerName: "Marcus Aurelius",
          customerEmail: "marcus@stoic.co",
          status: "Pending",
          details: { plan: "Cloud Migration", nodes: 12 },
          createdAt: new Date(Date.now() - 864e5).toISOString(),
          notifications: ["New order received from landing page"]
        }
      ];
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading DB file:", err);
    return [];
  }
};
var writeOrders = (orders) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("Error writing DB file:", err);
  }
};
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use("/uploads", express.static(UPLOADS_DIR));
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const config = readConfig();
  if (username === config.username && password === config.password) {
    res.json({ token: "cuva_admin_secure_session_token" });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});
app.post("/api/admin/change-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const config = readConfig();
  if (currentPassword !== config.password) {
    return res.status(400).json({ error: "Incorrect current password" });
  }
  config.password = newPassword;
  writeConfig(config);
  res.json({ success: true });
});
app.get("/api/admin/settings", (req, res) => {
  const config = readConfig();
  const { password, ...safeSettings } = config;
  res.json(safeSettings);
});
app.post("/api/admin/settings", (req, res) => {
  const {
    stripePublishableKey,
    stripeSecretKey,
    paypalClientId,
    canvaApiKey,
    paymentMode,
    deliveryFee,
    premiumDeliveryFee,
    minOrderWeightKg,
    premiumClients
  } = req.body;
  const config = readConfig();
  config.stripePublishableKey = stripePublishableKey || "";
  config.stripeSecretKey = stripeSecretKey || "";
  config.paypalClientId = paypalClientId || "";
  config.canvaApiKey = canvaApiKey || "";
  config.paymentMode = paymentMode || "sandbox";
  if (deliveryFee !== void 0) config.deliveryFee = Number(deliveryFee);
  if (premiumDeliveryFee !== void 0) config.premiumDeliveryFee = Number(premiumDeliveryFee);
  if (minOrderWeightKg !== void 0) config.minOrderWeightKg = Number(minOrderWeightKg);
  if (premiumClients !== void 0) config.premiumClients = premiumClients;
  writeConfig(config);
  const { password, ...safeSettings } = config;
  res.json(safeSettings);
});
app.get("/api/settings/public", (req, res) => {
  const config = readConfig();
  res.json({
    stripePublishableKey: config.stripePublishableKey || "",
    paypalClientId: config.paypalClientId || "",
    paymentMode: config.paymentMode || "sandbox",
    // Delivery fee settings for frontend
    deliveryFee: config.deliveryFee || 35,
    premiumDeliveryFee: config.premiumDeliveryFee || 45,
    minOrderWeightKg: config.minOrderWeightKg || 10,
    premiumClients: config.premiumClients || ["Jastel Water", "Surjen Healthcare"]
  });
});
app.post("/api/upload", (req, res) => {
  const form = new IncomingForm({
    uploadDir: UPLOADS_DIR,
    keepExtensions: true,
    maxFileSize: 25 * 1024 * 1024
    // 25MB
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ error: "File upload failed: " + err.message });
    }
    const fileField = files.file;
    if (!fileField) {
      return res.status(400).json({ error: "No file provided" });
    }
    const uploadedFile = Array.isArray(fileField) ? fileField[0] : fileField;
    const filename = path.basename(uploadedFile.filepath);
    const fileUrl = `/uploads/${filename}`;
    res.json({
      url: fileUrl,
      name: uploadedFile.originalFilename || filename,
      size: uploadedFile.size,
      type: uploadedFile.mimetype || "application/octet-stream"
    });
  });
});
app.get("/api/orders", (req, res) => {
  const orders = readOrders();
  res.json(orders);
});
app.post("/api/orders", (req, res) => {
  const orders = readOrders();
  const orderData = req.body;
  const newOrder = {
    ...orderData,
    id: `ORD-${Math.floor(1e3 + Math.random() * 9e3)}`,
    status: "Pending",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    notifications: [`New ${orderData.type || "order"} request received from landing page`]
  };
  orders.unshift(newOrder);
  writeOrders(orders);
  res.status(201).json(newOrder);
});
app.put("/api/orders/:id/status", (req, res) => {
  const orders = readOrders();
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ["Pending", "Reviewing", "Provisioned", "Completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }
  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  orders[orderIndex].status = status;
  orders[orderIndex].notifications.unshift(
    `Status updated to "${status}" on ${(/* @__PURE__ */ new Date()).toLocaleString()}`
  );
  writeOrders(orders);
  res.json(orders[orderIndex]);
});
app.post("/api/orders/:id/notifications", (req, res) => {
  const orders = readOrders();
  const { id } = req.params;
  const { message } = req.body;
  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  orders[orderIndex].notifications.unshift(message);
  writeOrders(orders);
  res.json(orders[orderIndex]);
});
app.patch("/api/orders/:id/note", (req, res) => {
  const orders = readOrders();
  const { id } = req.params;
  const { note } = req.body;
  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (!orders[orderIndex].adminNotes) {
    orders[orderIndex].adminNotes = [];
  }
  orders[orderIndex].adminNotes.unshift({
    text: note,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  orders[orderIndex].notifications.unshift(
    `Admin note added: "${note.substring(0, 60)}${note.length > 60 ? "..." : ""}"`
  );
  writeOrders(orders);
  res.json(orders[orderIndex]);
});
app.delete("/api/orders/:id", (req, res) => {
  const orders = readOrders();
  const { id } = req.params;
  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Order not found" });
  }
  const order = orders[orderIndex];
  if (order.details?.fileUrl) {
    const filename = path.basename(order.details.fileUrl);
    const filepath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (e) {
      }
    }
  }
  orders.splice(orderIndex, 1);
  writeOrders(orders);
  res.json({ success: true, message: `Order ${id} deleted` });
});
var readProducts = () => {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      const initialProducts = [
        { id: "t-shirts", label: "T-shirts / Branded Apparel", description: "Ultra-soft organic cotton garments silkscreened with water-based eco-inks.", basePrice: 16.5, unitLabel: "Garments", minQty: 10, category: "printing" },
        { id: "caps", label: "Custom Branded Caps", description: "High-quality headwear featuring custom embroidery or precision prints.", basePrice: 12, unitLabel: "Caps", minQty: 15, category: "printing" },
        { id: "banners", label: "Banners (Roll-up, Pull-up)", description: "Durable weather-proof canvas banners fitted with polished silver bamboo or aluminum constructs.", basePrice: 48, unitLabel: "Banners", minQty: 1, category: "printing" },
        { id: "stickers", label: "Stickers & Die-Cut Labels", description: "Premium vinyl labels with a smooth, glare-free matte varnish suitable for packaging.", basePrice: 0.22, unitLabel: "Labels", minQty: 100, category: "printing" },
        { id: "mugs", label: "Branded Mugs & Drinkware", description: "Handcrafted ceramic mugs or insulated travel containers with vibrant, lasting prints.", basePrice: 5.5, unitLabel: "Mugs", minQty: 20, category: "printing" },
        { id: "notebooks", label: "Notebooks & Note pads", description: "Hardcover hand-bound grid notebooks or soft-cover branded pads with recycled stock.", basePrice: 6, unitLabel: "Notebooks", minQty: 25, category: "printing" },
        { id: "menus", label: "Menus & Restaurant Stationery", description: "Water-resistant, beautifully typeset menu cards and table talkers for hospitality.", basePrice: 4.5, unitLabel: "Menus", minQty: 10, category: "printing" },
        { id: "custom", label: "Other Custom Printing (Bespoke)", description: "Got an unusual canvas, card, or box? Describe your dimension and material dreams below.", basePrice: 15, unitLabel: "Pieces", minQty: 5, category: "printing" }
      ];
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
      return initialProducts;
    }
    const data = fs.readFileSync(PRODUCTS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading products file:", err);
    return [];
  }
};
var writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error("Error writing products file:", err);
  }
};
app.get("/api/products", (req, res) => {
  const products = readProducts();
  res.json(products);
});
app.post("/api/products", (req, res) => {
  const products = readProducts();
  const { id, label, description, basePrice, unitLabel, minQty, category } = req.body;
  if (!id || !label || basePrice === void 0 || !unitLabel) {
    return res.status(400).json({ error: "Missing required fields: id, label, basePrice, unitLabel" });
  }
  const existingProduct = products.find((p) => p.id === id);
  if (existingProduct) {
    return res.status(400).json({ error: "Product ID already exists" });
  }
  const newProduct = {
    id,
    label,
    description: description || "",
    basePrice: Number(basePrice),
    unitLabel,
    minQty: Number(minQty) || 1,
    category: category || "printing"
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});
app.put("/api/products/:id", (req, res) => {
  const products = readProducts();
  const { id } = req.params;
  const { label, description, basePrice, unitLabel, minQty, category } = req.body;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  products[productIndex] = {
    ...products[productIndex],
    label: label ?? products[productIndex].label,
    description: description ?? products[productIndex].description,
    basePrice: basePrice !== void 0 ? Number(basePrice) : products[productIndex].basePrice,
    unitLabel: unitLabel ?? products[productIndex].unitLabel,
    minQty: minQty !== void 0 ? Number(minQty) : products[productIndex].minQty,
    category: category ?? products[productIndex].category
  };
  writeProducts(products);
  res.json(products[productIndex]);
});
app.delete("/api/products/:id", (req, res) => {
  const products = readProducts();
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  products.splice(productIndex, 1);
  writeProducts(products);
  res.json({ success: true, message: `Product ${id} deleted` });
});
var distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}
var server = createServer(app);
server.listen(PORT, () => {
  console.log(`\u{1F680} Cuvatech Server running on port ${PORT}`);
  console.log(`\u{1F4C1} Uploads directory: ${UPLOADS_DIR}`);
});
