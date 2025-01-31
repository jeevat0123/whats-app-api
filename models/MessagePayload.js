class MessagePayload {
  /**
   * @param {string} to - The recipient's phone number.
   * @param {string} templateName - The name of the WhatsApp template.
   * @param {string} languageCode - The language code for the template (default: 'en_US').
   * @param {Array<Object>} variables - Dynamic variables for the template placeholders.
   */
  constructor(to, templateName, languageCode = 'en_US', variables = []) {
    if (!to || !templateName) {
      throw new Error("Missing required fields: 'to' and 'templateName' are mandatory.");
    }
    this.messaging_product = 'whatsapp';
    this.to = to;
    this.type = 'template';
    this.template = {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: []
    };

    // Add variables only if they exist
    if (variables.length > 0) {
      this.template.components = [
        {
          type: 'body',
          parameters: variables.map((variable) => ({
            type: 'text',
            text: String(variable), // Convert to string to handle numbers or other types
          })),
        },
      ];
    }
  }

  toJSON() {
    return {
      messaging_product: this.messaging_product,
      to: this.to,
      type: this.type,
      template: this.template,
    };
  }
}

module.exports = MessagePayload;