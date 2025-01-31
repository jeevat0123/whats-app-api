require('dotenv').config(); // Use dotenv to load environment variables
const axios = require('axios');

// Load sensitive data from environment variables
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const RECEIVER_PHONE = process.env.RECEIVER_PHONE;

// Ensure required environment variables are set
if (!WHATSAPP_API_URL || !ACCESS_TOKEN || !RECEIVER_PHONE) {
  console.error("Missing required environment variables. Please set WHATSAPP_API_URL, ACCESS_TOKEN, and RECEIVER_PHONE.");
  process.exit(1);
}

// MessagePayload class for building the payload
class MessagePayload {
  /**
   * @param {string} to - The receiver's phone number (in E.164 format).
   * @param {string} templateName - The name of the WhatsApp template.
   * @param {string} languageCode - The language code for the template.
   */
  constructor(to, templateName, languageCode = 'en_US') {
    if (!to || !templateName) {
      throw new Error("Missing required fields: 'to' and 'templateName' are mandatory.");
    }

    this.messaging_product = "whatsapp";
    this.to = to;
    this.type = "template";
    this.template = {
      name: templateName,
      language: {
        code: languageCode
      }
    };
  }

  /**
   * Converts the payload to a plain object (suitable for JSON.stringify).
   * @returns {object} Plain object representation of the payload.
   */
  toJSON() {
    return {
      messaging_product: this.messaging_product,
      to: this.to,
      type: this.type,
      template: this.template
    };
  }
}

// Function to send a message
async function sendMessage() {
  try {
    // Create a new message payload instance
    const payload = new MessagePayload(RECEIVER_PHONE, "hello_world");

    // Configure the Axios request
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: WHATSAPP_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      data: payload.toJSON()
    };

    console.log("Sending message...");
    const response = await axios.request(config);
    console.log("Message sent successfully:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("Error Response:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error("No Response:", error.request);
    } else {
      // Error setting up the request
      console.error("Error:", error.message);
    }
  }
}

// Execute the function
sendMessage();
