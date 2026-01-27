import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializePostgres } from "./config/init_db.js";

// Import routes
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import categoriesRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import ordersRoutes from "./routes/orders.js";
import offerRoutes from "./routes/offer.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static("uploads"));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/offers", offerRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "مرحباً بك في API متجر جوهر 💎",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      categories: "/api/categories",
      cart: "/api/cart (protected)",
      wishlist: "/api/wishlist (protected)",
      orders: "/api/orders (protected)",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "المسار غير موجود",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "خطأ في الخادم",
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializePostgres();

    app.listen(PORT, () => {
      console.log("");
      console.log("╔════════════════════════════════════════╗");
      console.log("║   🚀 متجر جوهر - Backend Server      ║");
      console.log("╚════════════════════════════════════════╝");
      console.log("");
      console.log(`✅ Server running on: http://localhost:${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log("");
      console.log("📚 Available endpoints:");
      console.log(`   - GET  /api/health`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - GET  /api/products`);
      console.log(`   - GET  /api/categories`);
      console.log("");
      console.log("Press CTRL+C to stop the server");
      console.log("");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
