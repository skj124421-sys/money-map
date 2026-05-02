import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("moneymap.db");

// Initialize SQL Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    userId TEXT,
    date TEXT,
    description TEXT,
    amount REAL,
    category TEXT,
    type TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS holdings (
    id TEXT PRIMARY KEY,
    userId TEXT,
    assetName TEXT,
    assetType TEXT,
    value REAL,
    investedValue REAL,
    units REAL,
    symbol TEXT,
    lastUpdated TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS budgets (
    userId TEXT,
    category TEXT,
    "limit" REAL,
    PRIMARY KEY(userId, category),
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.listen(startPort, "0.0.0.0", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
}

async function startServer() {
  const app = express();
  let PORT = parseInt(process.env.PORT || "3000", 10);

  // Find an available port if default is in use
  PORT = await findAvailablePort(PORT);

  app.use(express.json());

  // --- API Routes ---

  // Auth: Register
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    const id = Math.random().toString(36).substring(2, 15);
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    try {
      const stmt = db.prepare("INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)");
      stmt.run(id, email, hashedPassword, name);
      res.json({ id, email, name });
    } catch (err) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Transactions
  app.get("/api/transactions/:userId", (req, res) => {
    const data = db.prepare("SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC").all(req.params.userId);
    res.json(data);
  });

  app.post("/api/transactions", (req, res) => {
    const { id, userId, date, description, amount, category, type } = req.body;
    const stmt = db.prepare("INSERT INTO transactions (id, userId, date, description, amount, category, type) VALUES (?, ?, ?, ?, ?, ?, ?)");
    stmt.run(id, userId, date, description, amount, category, type);
    res.status(201).json({ success: true });
  });

  app.put("/api/transactions/:id", (req, res) => {
    const { date, description, amount, category, type } = req.body;
    const stmt = db.prepare("UPDATE transactions SET date = ?, description = ?, amount = ?, category = ?, type = ? WHERE id = ?");
    stmt.run(date, description, amount, category, type, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/transactions/:id", (req, res) => {
    db.prepare("DELETE FROM transactions WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Holdings
  app.get("/api/holdings/:userId", (req, res) => {
    const data = db.prepare("SELECT * FROM holdings WHERE userId = ?").all(req.params.userId);
    res.json(data);
  });

  app.post("/api/holdings", (req, res) => {
    const { id, userId, assetName, assetType, value, investedValue, units, symbol } = req.body;
    const stmt = db.prepare("INSERT INTO holdings (id, userId, assetName, assetType, value, investedValue, units, symbol, lastUpdated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run(id, userId, assetName, assetType, value, investedValue, units, symbol, new Date().toISOString());
    res.status(201).json({ success: true });
  });

  app.put("/api/holdings/:id", (req, res) => {
    const { assetName, assetType, value, investedValue, units } = req.body;
    const lastUpdated = new Date().toISOString();
    const stmt = db.prepare("UPDATE holdings SET assetName = ?, assetType = ?, value = ?, investedValue = ?, units = ?, lastUpdated = ? WHERE id = ?");
    stmt.run(assetName, assetType, value, investedValue, units, lastUpdated, req.params.id);
    res.json({ success: true, lastUpdated });
  });

  app.delete("/api/holdings/:id", (req, res) => {
    db.prepare("DELETE FROM holdings WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Budgets
  app.get("/api/budgets/:userId", (req, res) => {
    const data = db.prepare("SELECT * FROM budgets WHERE userId = ?").all(req.params.userId);
    res.json(data);
  });

  app.post("/api/budgets", (req, res) => {
    const { userId, category, limit } = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO budgets (userId, category, 'limit') VALUES (?, ?, ?)");
    stmt.run(userId, category, limit);
    res.json({ success: true });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  }).on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
