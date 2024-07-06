const axios = require('axios');

module.exports.config = {
  name: 'pinterest',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'ChatGPT',
  description: 'Searches for images on Pinterest based on a query and returns up to 50 images.',
  commandCategory: 'general',
  usages: 'pinterest [query] - [number]',
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  // Check if the user has provided a query and a number
  const splitArgs = args.join(' ').split(' - ');
  if (splitArgs.length !== 2) {
    return api.sendMessage('Please provide a search query and a number of images to return. Usage: pinterest [query] - [number]', threadID, messageID);
  }

  const query = splitArgs[0];
  const number = parseInt(splitArgs[1]);

  // Validate the number
  if (isNaN(number) || number < 1 || number > 50) {
    return api.sendMessage('Please provide a valid number between 1 and 50.', threadID, messageID);
  }

  try {
    // Fetch images from the provided API
    const apiUrl = `https://joshweb.click/api/pinterest?q=${encodeURIComponent(query)}&num=${number}`;
    const response = await axios.get(apiUrl);

    if (!response.data || response.data.length === 0) {
      return api.sendMessage('No images found. Please try again with a different query.', threadID, messageID);
    }

    // Send the requested number of images
    const attachments = await Promise.all(
      response.data.slice(0, number).map(async img => ({
        attachment: await axios.get(img.url, { responseType: 'stream' }).then(res => res.data),
      }))
    );

    for (const attachment of attachments) {
      await api.sendMessage({
        body: `Here is an image for "${query}":`,
        attachment: attachment.attachment,
      }, threadID, messageID);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    api.sendMessage('An error occurred while fetching images. Please try again later.', threadID, messageID);
  }
};
