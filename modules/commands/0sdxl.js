const axios = require('axios');

module.exports.config = {
  name: 'sdxl',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'ChatGPT',
  description: 'Generates an image using the SDXL API. Supported styles: anime, fantasy, pencil, digital, vintage, 3d (render), cyberpunk, manga, realistic, demonic, heavenly, comic, robotic.',
  commandCategory: 'general',
  usages: 'sdxl [style] [prompt]',
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  // Check if the user has provided both style and prompt
  if (args.length < 2) {
    return api.sendMessage('Please provide both a style and a prompt. Usage: sdxl [style] [prompt]', threadID, messageID);
  }

  const style = args.shift(); // Get the first argument as style
  const prompt = args.join(' '); // Join the rest of the arguments to form the prompt

  try {
    // Fetch image from the provided API
    const apiUrl = `https://joshweb.click/sdxl/list?style=${encodeURIComponent(style)}&prompt=${encodeURIComponent(prompt)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.imageUrl) {
      return api.sendMessage('Failed to generate image. Please try again with a different style and prompt.', threadID, messageID);
    }

    const imageUrl = response.data.imageUrl; // Adjust as per API response structure

    // Send the image URL as a message
    api.sendMessage(`Generated image: ${imageUrl}`, threadID, messageID);
  } catch (error) {
    console.error('Error fetching image:', error);
    api.sendMessage('An error occurred while generating the image. Please try again later.', threadID, messageID);
  }
};
