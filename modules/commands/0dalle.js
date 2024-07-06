const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "dalle",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Generates an image based on a prompt using DALL-E API.",
  commandCategory: "image",
  usages: "[prompt]",
  cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("Please provide a prompt.", event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://joshweb.click/dalle?prompt=${encodeURIComponent(prompt)}`, {
      responseType: "arraybuffer",
    });

    const fileName = `dalle-${Date.now()}.jpg`; // Unique filename
    fs.writeFileSync(fileName, Buffer.from(response.data));

    api.sendMessage({ attachment: fs.createReadStream(fileName) }, event.threadID, () => {
      fs.unlinkSync(fileName); // Delete the file after sending
    });
  } catch (error) {
    console.error("Error generating image:", error);
    api.sendMessage("An error occurred while generating the image. Please try again later.", event.threadID, event.messageID);
  }
};
