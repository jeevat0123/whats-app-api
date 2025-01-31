# Modular WhatsApp Messaging Application Documentation

This documentation provides a comprehensive guide for the modularized WhatsApp messaging application. It covers the file structure, code organization, environment setup, and the step-by-step process of how the application works end-to-end. This structure adheres to production-level best practices.

---

## **Overview**

The purpose of this application is to send messages via the WhatsApp API using a modularized approach. The code has been structured into separate files to enhance reusability, maintainability, and scalability. Sensitive data such as API keys and phone numbers are managed using environment variables.

---

## **File Structure**

Below is the folder structure of the project:

```
project/
├── .env                # Environment variables
├── package.json        # Node.js dependencies
├── app.js              # Entry point of the application
├── config/
│   └── axiosConfig.js  # Axios configuration
├── models/
│   └── MessagePayload.js  # Message payload model
├── services/
│   └── whatsappService.js  # WhatsApp messaging service
```

### **File Descriptions**

1. **`.env`:**
   - Contains sensitive configuration data such as API URLs, access tokens, and phone numbers.

2. **`app.js`:**
   - The entry point of the application. This file initializes the environment and triggers the message-sending process.

3. **`config/axiosConfig.js`:**
   - Manages the Axios configuration, including API URL, headers, and access token.

4. **`models/MessagePayload.js`:**
   - Defines the `MessagePayload` class, which structures the WhatsApp API request payload.

5. **`services/whatsappService.js`:**
   - Contains the logic for sending a WhatsApp message using the configured API.

---

## **Environment Variables**

The application uses the `.env` file to store sensitive data. Create a `.env` file in the project root and add the following variables:

```plaintext
WHATSAPP_API_URL=https://graph.facebook.com/v21.0/516737254861638/messages
ACCESS_TOKEN=<TOKEN>
RECEIVER_PHONE=<NUM>
```

### **Environment Variable Descriptions**

- **`WHATSAPP_API_URL`:** The URL endpoint for the WhatsApp API.
- **`ACCESS_TOKEN`:** The access token for authentication with the WhatsApp API.
- **`RECEIVER_PHONE`:** The recipient's phone number in E.164 format.

---

## **Code Walkthrough**

### **1. Axios Configuration (`config/axiosConfig.js`):**

This file sets up an Axios instance for making HTTP requests. It centralizes the API URL, headers, and access token.

```javascript
require('dotenv').config();
const axios = require('axios');

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!WHATSAPP_API_URL || !ACCESS_TOKEN) {
  console.error("Missing required environment variables. Please set WHATSAPP_API_URL and ACCESS_TOKEN.");
  process.exit(1);
}

const axiosInstance = axios.create({
  baseURL: WHATSAPP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`
  },
  maxBodyLength: Infinity
});

module.exports = axiosInstance;
```

---

### **2. Message Payload Model (`models/MessagePayload.js`):**

This file defines the `MessagePayload` class, which encapsulates the structure of the WhatsApp message payload. It includes validation for required fields.

```javascript
class MessagePayload {
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

  toJSON() {
    return {
      messaging_product: this.messaging_product,
      to: this.to,
      type: this.type,
      template: this.template
    };
  }
}

module.exports = MessagePayload;
```

---

### **3. WhatsApp Service (`services/whatsappService.js`):**

This service contains the logic for sending a WhatsApp message using the Axios instance and the `MessagePayload` model.

```javascript
const axiosInstance = require('../config/axiosConfig');
const MessagePayload = require('../models/MessagePayload');

async function sendWhatsAppMessage(to, templateName) {
  try {
    const payload = new MessagePayload(to, templateName);

    console.log("Sending message...");
    const response = await axiosInstance.post('', payload.toJSON());
    console.log("Message sent successfully:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error("Error Response:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No Response:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
}

module.exports = { sendWhatsAppMessage };
```

---

### **4. Application Entry Point (`app.js`):**

This is the main file that initializes the environment and triggers the message-sending process.

```javascript
require('dotenv').config();
const { sendWhatsAppMessage } = require('./services/whatsappService');

const RECEIVER_PHONE = process.env.RECEIVER_PHONE;

if (!RECEIVER_PHONE) {
  console.error("Missing required environment variable: RECEIVER_PHONE.");
  process.exit(1);
}

(async () => {
  try {
    const templateName = "hello_world"; // Replace with your template name
    await sendWhatsAppMessage(RECEIVER_PHONE, templateName);
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);
  }
})();
```

---

## **How It Works**

1. **Setup Environment:**
   - Environment variables are loaded from `.env`.
   - The `WHATSAPP_API_URL`, `ACCESS_TOKEN`, and `RECEIVER_PHONE` are validated.

2. **Axios Configuration:**
   - An Axios instance is created with the API URL, headers, and authorization token.

3. **Message Payload Creation:**
   - The `MessagePayload` model ensures the payload adheres to the required structure for the WhatsApp API.

4. **Send Message:**
   - The `sendWhatsAppMessage` function sends the payload using Axios and logs the response or error.

5. **Run Application:**
   - The `app.js` file orchestrates the process, sending a WhatsApp message using the specified template and recipient.

---

## **Steps to Run**

1. **Install Dependencies:**
   ```bash
   npm install axios dotenv
   ```

2. **Set Up Environment Variables:**
   - Create a `.env` file in the root directory with the required variables.

3. **Run the Application:**
   ```bash
   node app.js
   ```

---

## **Future Enhancements**

1. **Error Handling:**
   - Add retry mechanisms for network failures.
   - Log errors to a monitoring service (e.g., Sentry).

2. **Dynamic Templates:**
   - Extend the `MessagePayload` class to support dynamic template parameters.

3. **Testing:**
   - Add unit and integration tests for each module.

4. **Logging:**
   - Implement a logging framework (e.g., Winston) for better log management.

---

This modularized approach ensures the application is maintainable, scalable, and ready for production.

