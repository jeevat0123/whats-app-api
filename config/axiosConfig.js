require('dotenv').config();

const axios = require('axios');

// Load sensitive data from environment variables
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Ensure required environment variables are set
if (!WHATSAPP_API_URL || !ACCESS_TOKEN) {
  console.error("Missing required environment variables. Please set WHATSAPP_API_URL and ACCESS_TOKEN.");
  process.exit(1);
}

// Create and export Axios instance
const axiosInstance = axios.create({
  baseURL: WHATSAPP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  },
  maxBodyLength: Infinity // Allow large payloads
});

module.exports = axiosInstance;
