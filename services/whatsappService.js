const axiosInstance = require('../config/axiosConfig');
const MessagePayload = require('../models/MessagePayload');

/**
 * Sends a WhatsApp message using the provided template and dynamic variables.
 * @param {string} to - The recipient's phone number.
 * @param {string} templateName - The name of the WhatsApp template.
 * @param {Array<Object>} variables - Dynamic variables for the template placeholders.
 * @param {string} languageCode - The language code for the template (default: 'en_US').
 * @returns {Promise<Object>} - The response from the WhatsApp API.
 */
const sendWhatsAppMessage = async (to, templateName, variables = [], languageCode = 'en_US') => {
  try {
    console.log('Sending message...');
    const payload = new MessagePayload(to, templateName, languageCode, variables);
    const response = await axiosInstance.post('', payload.toJSON());
    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
};

module.exports = { sendWhatsAppMessage };
