const axios = require('axios');

module.exports.config = {
  name: 'shoti',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'ChatGPT',
  description: 'Fetches content from a TikTok downloader API.',
  commandCategory: 'media',
  usages: '',
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const apiUrl = 'https://www.jjohndev.xyz/tool/tiktok-downloader/';
  
  try {
    // Send a message indicating it's sending content
    api.sendMessage('Sending babes 😘😚...', event.threadID, event.messageID);

    // Make a request to the API (example using axios)
    const response = await axios.get(apiUrl);
    
    // Handle the response (you can process or send the data here)
    const data = response.data;
    // Example: Send the received data
    api.sendMessage(data, event.threadID);
  } catch (error) {
    console.error('Error fetching data:', error);
    api.sendMessage('An error occurred while fetching data. Please try again later.', event.threadID, event.messageID);
  }
};
