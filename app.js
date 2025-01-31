require('dotenv').config();
const { sendWhatsAppMessage } = require('./services/whatsappService');

// Load environment variables
const RECEIVER_PHONE = process.env.RECEIVER_PHONE;

// Ensure the required environment variable is set
if (!RECEIVER_PHONE) {
  console.error("Missing required environment variable: RECEIVER_PHONE.");
  process.exit(1);
}

// Send a WhatsApp message
(async () => {
  try {
    const templateName = "jeeva"; // Replace with your template name
    const variable = ["Swwtha", "zukacin", "haha"]
    const languageCode = "en"
    await sendWhatsAppMessage(RECEIVER_PHONE, templateName,variable,languageCode );
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.message);
  }
})();
