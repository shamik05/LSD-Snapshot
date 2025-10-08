const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(compression());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { COINCAP_API_KEY, NEWS_API_KEY, GNEWS_API_KEY, SES_USER, SES_PASS } = process.env;

const transport = nodemailer.createTransport({
  host: "email-smtp.us-east-2.amazonaws.com",
  port: 587,
  secure: false,
  auth: {
      user: SES_USER,
      pass: SES_PASS
  },
  tls: {
    rejectUnauthorized: false,
  },
});

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

app.post("/api/contact", async (req, res) => {
  try {

    // try {
    //   await transport.verify();
    //   console.log("Server is ready to take our messages");
    // } catch (err) {
    //   console.error("Verification failed", err);
    // }

    const { name, email, message } = req.body;
    
    const info = await transport.sendMail({
      from: '"LSDContact Form" <shamikhaldar05@gmail.com>',
      to: "shamikhaldar05@gmail.com",
      subject: "LSD Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });
    
    console.log('Email sent successfully:', info.messageId);
    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error("Contact Form Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to send message",
      details: error.response?.data || error.message,
    });
  }
});

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
