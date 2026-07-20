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
var PORTFOLIO_FILE = path.join(__dirname, "portfolio.json");
var BLOG_FILE = path.join(__dirname, "blog.json");
var SITE_INFO_FILE = path.join(__dirname, "site-info.json");
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
        canva: { createUrl: "https://www.canva.com/", templates: [] },
        paymentMode: "sandbox",
        // Delivery fee settings
        deliveryFee: 35,
        premiumDeliveryFee: 45,
        premiumClients: ["Jastel Water", "Surjen Healthcare"]
      };
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    }
    const data = fs.readFileSync(CONFIG_FILE, "utf8");
    const config = JSON.parse(data);
    if (config.deliveryFee === void 0) config.deliveryFee = 35;
    if (config.premiumDeliveryFee === void 0) config.premiumDeliveryFee = 45;
    if (!config.premiumClients) config.premiumClients = ["Jastel Water", "Surjen Healthcare"];
    if (!config.canva) config.canva = { createUrl: "https://www.canva.com/", templates: [] };
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
    premiumClients
  } = req.body;
  const config = readConfig();
  if (deliveryFee !== void 0 && (!Number.isFinite(Number(deliveryFee)) || Number(deliveryFee) < 0)) {
    return res.status(400).json({ error: "deliveryFee must be zero or greater" });
  }
  if (premiumDeliveryFee !== void 0 && (!Number.isFinite(Number(premiumDeliveryFee)) || Number(premiumDeliveryFee) < 0)) {
    return res.status(400).json({ error: "premiumDeliveryFee must be zero or greater" });
  }
  if (stripePublishableKey !== void 0) config.stripePublishableKey = stripePublishableKey;
  if (stripeSecretKey !== void 0) config.stripeSecretKey = stripeSecretKey;
  if (paypalClientId !== void 0) config.paypalClientId = paypalClientId;
  if (canvaApiKey !== void 0) config.canvaApiKey = canvaApiKey;
  if (paymentMode !== void 0) config.paymentMode = paymentMode;
  if (deliveryFee !== void 0) config.deliveryFee = Number(deliveryFee);
  if (premiumDeliveryFee !== void 0) config.premiumDeliveryFee = Number(premiumDeliveryFee);
  if (premiumClients !== void 0) config.premiumClients = premiumClients;
  if (req.body.canva !== void 0) config.canva = req.body.canva;
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
    deliveryFee: config.deliveryFee ?? 35,
    premiumDeliveryFee: config.premiumDeliveryFee ?? 45,
    premiumClients: config.premiumClients || ["Jastel Water", "Surjen Healthcare"],
    canva: config.canva || { createUrl: "https://www.canva.com/", templates: [] }
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
        { id: "t-shirts", label: "T-shirts / Branded Apparel", description: "Ultra-soft organic cotton garments silkscreened with water-based eco-inks.", basePrice: 20, unitLabel: "Garments", minOrderWeightKg: 10, weightPerUnitKg: 0.2, category: "printing" },
        { id: "caps", label: "Custom Branded Caps", description: "High-quality headwear featuring custom embroidery or precision prints.", basePrice: 12, unitLabel: "Caps", minOrderWeightKg: 10, weightPerUnitKg: 0.15, category: "printing" },
        { id: "banners", label: "Banners (Roll-up, Pull-up)", description: "Durable weather-proof canvas banners fitted with polished silver bamboo or aluminum constructs.", basePrice: 48, unitLabel: "Banners", minOrderWeightKg: 10, weightPerUnitKg: 0.5, category: "printing" },
        { id: "stickers", label: "Stickers & Die-Cut Labels", description: "Premium vinyl labels with a smooth, glare-free matte varnish suitable for packaging.", basePrice: 0.22, unitLabel: "Labels", minOrderWeightKg: 10, weightPerUnitKg: 0.015, category: "printing" },
        { id: "mugs", label: "Branded Mugs & Drinkware", description: "Handcrafted ceramic mugs or insulated travel containers with vibrant, lasting prints.", basePrice: 5.5, unitLabel: "Mugs", minOrderWeightKg: 10, weightPerUnitKg: 0.35, category: "printing" },
        { id: "notebooks", label: "Notebooks & Note pads", description: "Hardcover hand-bound grid notebooks or soft-cover branded pads with recycled stock.", basePrice: 6, unitLabel: "Notebooks", minOrderWeightKg: 10, weightPerUnitKg: 0.35, category: "printing" },
        { id: "menus", label: "Menus & Restaurant Stationery", description: "Water-resistant, beautifully typeset menu cards and table talkers for hospitality.", basePrice: 4.5, unitLabel: "Menus", minOrderWeightKg: 10, weightPerUnitKg: 0.05, category: "printing" },
        { id: "custom", label: "Other Custom Printing (Bespoke)", description: "Got an unusual canvas, card, or box? Describe your dimension and material dreams below.", basePrice: 15, unitLabel: "Pieces", minOrderWeightKg: 10, weightPerUnitKg: 0.2, category: "printing" }
      ];
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
      return initialProducts;
    }
    const data = fs.readFileSync(PRODUCTS_FILE, "utf8");
    const products = JSON.parse(data);
    for (const product of products) {
      if (typeof product.minOrderWeightKg !== "number" || product.minOrderWeightKg <= 0) {
        product.minOrderWeightKg = Number.isFinite(product.minQty) && product.minQty > 0 && product.weightPerUnitKg > 0 ? Math.ceil(product.minQty * product.weightPerUnitKg) : 10;
      }
      delete product.minQty;
    }
    const seenIds = /* @__PURE__ */ new Set();
    let idsChanged = false;
    products.forEach((product, index) => {
      const safeId = slugify(product.id || "");
      let candidate = safeId || `product-${index}`;
      while (seenIds.has(candidate)) candidate = `${candidate}-${index}`;
      if (candidate !== product.id) {
        product.id = candidate;
        idsChanged = true;
      }
      seenIds.add(product.id);
    });
    if (idsChanged) writeProducts(products);
    return products;
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
  const { id, label, description, basePrice, unitLabel, minOrderWeightKg, weightPerUnitKg, category, imageUrl } = req.body;
  const numericBasePrice = Number(basePrice);
  const numericMinOrderWeightKg = Number(minOrderWeightKg);
  const numericWeightPerUnitKg = Number(weightPerUnitKg);
  if (!label || !unitLabel || !Number.isFinite(numericBasePrice) || numericBasePrice <= 0 || !Number.isFinite(numericMinOrderWeightKg) || numericMinOrderWeightKg <= 0 || !Number.isFinite(numericWeightPerUnitKg) || numericWeightPerUnitKg <= 0) {
    return res.status(400).json({ error: "Missing or invalid required fields: label, basePrice, unitLabel, minOrderWeightKg, weightPerUnitKg" });
  }
  const productId = id && typeof id === "string" && id.trim() ? slugify(id) : slugify(label);
  if (!productId) {
    return res.status(400).json({ error: "A valid product id (or label) is required" });
  }
  const existingProduct = products.find((p) => p.id === productId);
  if (existingProduct) {
    return res.status(400).json({ error: "Product ID already exists" });
  }
  const newProduct = {
    id: productId,
    label,
    description: description || "",
    basePrice: numericBasePrice,
    unitLabel,
    minOrderWeightKg: numericMinOrderWeightKg,
    weightPerUnitKg: numericWeightPerUnitKg,
    category: category || "printing",
    ...imageUrl ? { imageUrl } : {}
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});
app.put("/api/products/:id", (req, res) => {
  const products = readProducts();
  const { id } = req.params;
  const { label, description, basePrice, unitLabel, minOrderWeightKg, weightPerUnitKg, category, imageUrl } = req.body;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }
  if (basePrice !== void 0 && (!Number.isFinite(Number(basePrice)) || Number(basePrice) <= 0)) {
    return res.status(400).json({ error: "basePrice must be greater than zero" });
  }
  if (minOrderWeightKg !== void 0 && (!Number.isFinite(Number(minOrderWeightKg)) || Number(minOrderWeightKg) <= 0)) {
    return res.status(400).json({ error: "minOrderWeightKg must be greater than zero" });
  }
  if (weightPerUnitKg !== void 0 && (!Number.isFinite(Number(weightPerUnitKg)) || Number(weightPerUnitKg) <= 0)) {
    return res.status(400).json({ error: "weightPerUnitKg must be greater than zero" });
  }
  products[productIndex] = {
    ...products[productIndex],
    label: label ?? products[productIndex].label,
    description: description ?? products[productIndex].description,
    basePrice: basePrice !== void 0 ? Number(basePrice) : products[productIndex].basePrice,
    unitLabel: unitLabel ?? products[productIndex].unitLabel,
    minOrderWeightKg: minOrderWeightKg !== void 0 ? Number(minOrderWeightKg) : products[productIndex].minOrderWeightKg,
    weightPerUnitKg: weightPerUnitKg !== void 0 ? Number(weightPerUnitKg) : products[productIndex].weightPerUnitKg,
    category: category ?? products[productIndex].category,
    imageUrl: imageUrl || void 0
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
var ADMIN_TOKEN = "cuva_admin_secure_session_token";
var requireAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
var slugify = (text) => text.toString().toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
var readPortfolio = () => {
  try {
    if (!fs.existsSync(PORTFOLIO_FILE)) {
      fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify([], null, 2));
      return [];
    }
    return JSON.parse(fs.readFileSync(PORTFOLIO_FILE, "utf8"));
  } catch (err) {
    console.error("Error reading portfolio file:", err);
    return [];
  }
};
var writePortfolio = (items) => {
  try {
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(items, null, 2));
  } catch (err) {
    console.error("Error writing portfolio file:", err);
  }
};
var readBlog = () => {
  try {
    if (!fs.existsSync(BLOG_FILE)) {
      fs.writeFileSync(BLOG_FILE, JSON.stringify([], null, 2));
      return [];
    }
    return JSON.parse(fs.readFileSync(BLOG_FILE, "utf8"));
  } catch (err) {
    console.error("Error reading blog file:", err);
    return [];
  }
};
var writeBlog = (posts) => {
  try {
    fs.writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error("Error writing blog file:", err);
  }
};
var DEFAULT_SITE_INFO = {
  phone: "",
  email: "",
  address: "",
  openingHours: "",
  closingHours: "",
  socials: { x: "", tiktok: "", instagram: "", linkedin: "" },
  brandTagline: ""
};
var readSiteInfo = () => {
  try {
    if (!fs.existsSync(SITE_INFO_FILE)) {
      fs.writeFileSync(SITE_INFO_FILE, JSON.stringify(DEFAULT_SITE_INFO, null, 2));
      return DEFAULT_SITE_INFO;
    }
    const info = JSON.parse(fs.readFileSync(SITE_INFO_FILE, "utf8"));
    return {
      ...DEFAULT_SITE_INFO,
      ...info,
      socials: { ...DEFAULT_SITE_INFO.socials, ...info.socials || {} }
    };
  } catch (err) {
    console.error("Error reading site-info file:", err);
    return DEFAULT_SITE_INFO;
  }
};
var writeSiteInfo = (info) => {
  try {
    fs.writeFileSync(SITE_INFO_FILE, JSON.stringify(info, null, 2));
  } catch (err) {
    console.error("Error writing site-info file:", err);
  }
};
app.get("/api/portfolio", (req, res) => {
  res.json(readPortfolio());
});
app.post("/api/portfolio", requireAdmin, (req, res) => {
  const items = readPortfolio();
  const { id, title, description, imageUrl, link, category, order } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  const itemId = id && typeof id === "string" && id.trim() ? slugify(id) : slugify(title);
  if (items.find((p) => p.id === itemId)) {
    return res.status(400).json({ error: "Portfolio item id already exists" });
  }
  const newItem = {
    id: itemId,
    title: title.trim(),
    description: description || "",
    imageUrl: imageUrl || null,
    link: link || "",
    category: category || "",
    order: Number.isFinite(Number(order)) ? Number(order) : 0,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  items.push(newItem);
  writePortfolio(items);
  res.status(201).json(newItem);
});
app.put("/api/portfolio/:id", requireAdmin, (req, res) => {
  const items = readPortfolio();
  const { id } = req.params;
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Portfolio item not found" });
  }
  const { title, description, imageUrl, link, category, order } = req.body;
  items[idx] = {
    ...items[idx],
    title: title ?? items[idx].title,
    description: description ?? items[idx].description,
    imageUrl: imageUrl !== void 0 ? imageUrl || null : items[idx].imageUrl,
    link: link ?? items[idx].link,
    category: category ?? items[idx].category,
    order: order !== void 0 ? Number.isFinite(Number(order)) ? Number(order) : items[idx].order : items[idx].order
  };
  writePortfolio(items);
  res.json(items[idx]);
});
app.delete("/api/portfolio/:id", requireAdmin, (req, res) => {
  const items = readPortfolio();
  const { id } = req.params;
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Portfolio item not found" });
  }
  const removed = items[idx];
  if (removed.imageUrl) {
    const filepath = path.join(UPLOADS_DIR, path.basename(removed.imageUrl));
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (e) {
      }
    }
  }
  items.splice(idx, 1);
  writePortfolio(items);
  res.json({ success: true, message: `Portfolio item ${id} deleted` });
});
app.get("/api/blog", (req, res) => {
  const posts = readBlog();
  if (req.query.status === "published") {
    return res.json(posts.filter((p) => p.status === "published"));
  }
  res.json(posts);
});
app.get("/api/blog/:slug", (req, res) => {
  const posts = readBlog();
  const post = posts.find((p) => p.slug === req.params.slug && p.status === "published");
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});
app.post("/api/blog", requireAdmin, (req, res) => {
  const posts = readBlog();
  const { title, content, excerpt, coverImageUrl, author, tags, status, slug } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "content is required" });
  }
  const baseSlug = slug && typeof slug === "string" && slug.trim() ? slugify(slug) : slugify(title);
  let finalSlug = baseSlug;
  let n = 2;
  while (posts.find((p) => p.slug === finalSlug)) {
    finalSlug = `${baseSlug}-${n}`;
    n++;
  }
  const newPost = {
    id: `blog-${Date.now()}`,
    slug: finalSlug,
    title: title.trim(),
    excerpt: excerpt || "",
    content,
    coverImageUrl: coverImageUrl || null,
    author: author || "",
    tags: Array.isArray(tags) ? tags : [],
    status: status === "published" ? "published" : "draft",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  posts.push(newPost);
  writeBlog(posts);
  res.status(201).json(newPost);
});
app.put("/api/blog/:id", requireAdmin, (req, res) => {
  const posts = readBlog();
  const { id } = req.params;
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  const { title, content, excerpt, coverImageUrl, author, tags, status, slug } = req.body;
  const post = posts[idx];
  const resolveSlug = (source) => {
    let base = slugify(source);
    let candidate = base;
    let n = 2;
    while (posts.find((p) => p.slug === candidate && p.id !== id)) {
      candidate = `${base}-${n}`;
      n++;
    }
    return candidate;
  };
  if (slug && typeof slug === "string" && slug.trim()) {
    post.slug = resolveSlug(slug);
  } else if (title && title !== post.title) {
    post.slug = resolveSlug(title);
  }
  post.title = title ?? post.title;
  post.content = content ?? post.content;
  post.excerpt = excerpt ?? post.excerpt;
  post.coverImageUrl = coverImageUrl !== void 0 ? coverImageUrl || null : post.coverImageUrl;
  post.author = author ?? post.author;
  post.tags = tags !== void 0 ? Array.isArray(tags) ? tags : [] : post.tags;
  post.status = status ?? post.status;
  post.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  writeBlog(posts);
  res.json(post);
});
app.delete("/api/blog/:id", requireAdmin, (req, res) => {
  const posts = readBlog();
  const { id } = req.params;
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  const removed = posts[idx];
  if (removed.coverImageUrl) {
    const filepath = path.join(UPLOADS_DIR, path.basename(removed.coverImageUrl));
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
      } catch (e) {
      }
    }
  }
  posts.splice(idx, 1);
  writeBlog(posts);
  res.json({ success: true, message: `Post ${id} deleted` });
});
var SITE_INFO_FIELDS = ["phone", "email", "address", "openingHours", "closingHours", "brandTagline"];
var SITE_INFO_SOCIALS = ["x", "tiktok", "instagram", "linkedin"];
app.get("/api/site-info", (req, res) => {
  res.json(readSiteInfo());
});
app.put("/api/site-info", requireAdmin, (req, res) => {
  const current = readSiteInfo();
  const body = req.body || {};
  const updated = { ...current };
  for (const field of SITE_INFO_FIELDS) {
    if (body[field] !== void 0) updated[field] = body[field];
  }
  const socials = { ...current.socials || {} };
  for (const s of SITE_INFO_SOCIALS) {
    if (body.socials && body.socials[s] !== void 0) socials[s] = body.socials[s];
  }
  updated.socials = socials;
  writeSiteInfo(updated);
  res.json(updated);
});
app.get("/api/uploads", (req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const fileDetails = files.map((filename) => {
      const filepath = path.join(UPLOADS_DIR, filename);
      const stat = fs.statSync(filepath);
      const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
      const isImage = ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext.replace(".", ""));
      return {
        filename,
        size: stat.size,
        sizeKB: Math.round(stat.size / 1024),
        url: `/uploads/${filename}`,
        type: isImage ? `image/${ext.replace(".", "")}` : "application/octet-stream",
        uploadedAt: stat.mtime
      };
    });
    res.json(fileDetails);
  } catch (err) {
    console.error("Error listing uploads:", err);
    res.status(500).json({ error: "Failed to list uploaded files" });
  }
});
app.delete("/api/uploads/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "File not found" });
    }
    fs.unlinkSync(filepath);
    res.json({ success: true, message: `File ${filename} deleted` });
  } catch (err) {
    console.error("Error deleting upload:", err);
    res.status(500).json({ error: "Failed to delete file" });
  }
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
