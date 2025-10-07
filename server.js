const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(compression());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Environment variables for your API tokens
const { COINCAP_API_KEY } = process.env;
const { NEWS_API_KEY } = process.env;
const { GNEWS_API_KEY } = process.env;

app.get("/api/coincap/history/:coin", async (req, res) => {
  try {
    const { coin } = req.params;
    const { interval, start, end } = req.query;

    const response = await axios.get(
      `https://rest.coincap.io/v3/assets/${coin}/history`,
      {
        params: { interval, start, end },
        headers: {
          Authorization: `Bearer ${COINCAP_API_KEY}`,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error("CoinCap History Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch historical data",
      details: error.response?.data || error.message,
    });
  }
});

app.get("/api/coincap/rates/:coin", async (req, res) => {
  try {
    const { coin } = req.params;

    const response = await axios.get(
      `https://rest.coincap.io/v3/rates/${coin}`,
      {
        headers: {
          Authorization: `Bearer ${COINCAP_API_KEY}`,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error("CoinCap Rates Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch live price",
      details: error.response?.data || error.message,
    });
  }
});

// NewsAPI.org - Crypto News
app.get("/api/news", async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      "https://newsapi.org/v2/everything",
      {
        params: {
          q: `${q} crypto`,
          language: "en",
          sortBy: "publishedAt",
          apiKey: NEWS_API_KEY,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error("NewsAPI Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch news",
      details: error.response?.data || error.message,
    });
  }
});

// GNews API - Modal News
app.get("/api/gnews", async (req, res) => {
  try {
    const { q } = req.query;

    const response = await axios.get(
      "https://gnews.io/api/v4/search",
      {
        params: {
          q,
          token: GNEWS_API_KEY,
          lang: "en",
          max: 10,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.error("GNews Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to fetch GNews",
      details: error.response?.data || error.message,
    });
  }
});

// Formspree Contact Form Proxy (if needed)
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const response = await axios.post(
      "https://formspree.io/f/xwkrpzap",
      {
        name,
        email,
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact Form Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to send message",
      details: error.response?.data || error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});
