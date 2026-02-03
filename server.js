const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { handleInput } = require("./coreEngine");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

const BETA_KEY = "mirror-closed";
const MAX_SESSIONS = 20;

const sessions = {};
const rateLimit = {};

function allowed(sessionId) {
  const now = Date.now();
  rateLimit[sessionId] = rateLimit[sessionId] || [];
  rateLimit[sessionId] = rateLimit[sessionId].filter(t => now - t < 60000);
  if (rateLimit[sessionId].length >= 10) return false;
  rateLimit[sessionId].push(now);
  return true;
}

app.post("/input", (req, res) => {
  if (req.headers["x-beta-key"] !== BETA_KEY) {
    return res.json({ type: "silence" });
  }

  const { session_id, text } = req.body;
  if (!session_id) return res.json({ type: "silence" });

  if (!sessions[session_id]) {
    if (Object.keys(sessions).length >= MAX_SESSIONS) {
      return res.json({ type: "silence" });
    }
    sessions[session_id] = { hasAskedSingleQuestion: false, history: [] };
  }

  if (!allowed(session_id)) {
    return res.json({ type: "silence" });
  }

  const state = sessions[session_id];
  const output = handleInput(
    { text, session_id, history: state.history },
    state
  );

  state.history.push({ text });
  res.json(output);
});
// ROOT – backend çalışıyor mu?
app.get("/", (req, res) => {
  res.json({
    status: "running",
    service: "mirror-backend",
    message: "Mirror backend is alive"
  });
});

// HEALTH – sistem durumu
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// META – sürüm bilgisi
app.get("/meta", (req, res) => {
  res.json({
    service: "mirror-backend",
    version: "0.1.0",
    environment: process.env.NODE_ENV || "development"
  });
});
app.post("/api/analyze", (req, res) => {
  const { session_id, text } = req.body;

  if (!session_id || !text) {
    return res.status(400).json({
      status: "error",
      message: "session_id and text are required"
    });
  }

  res.json({
    status: "ok",
    input: text,
    analysis: {
      assumptions: [],
      risks: [],
      alternatives: []
    }
  });
});
// 404 – Tanımsız endpoint
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

app.listen(3000, () => {
  console.log("Mirror engine running on port 3000");
});
