const axios = require('axios');

module.exports.config = {
  name: 'tempmail',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'ChatGPT',
  description: 'Fetches a temporary email address.',
  commandCategory: 'general',
  usages: 'tempmail',
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  try {
    // Fetch temporary email from the provided API
    const apiUrl = 'https://joshweb.click/tempmail/create';
    const response = await axios.get(apiUrl);
    const tempMail = response.data.email; // Adjust as per API response structure

    // Construct the message to send
    const message = `Here is your temporary email address: ${tempMail}`;

    // Send the constructed message
    api.sendMessage(message, threadID, messageID);
  } catch (error) {
    console.error('Error fetching temporary email:', error);
    api.sendMessage('An error occurred while fetching the temporary email address. Please try again later.', threadID, messageID);
  }
};
