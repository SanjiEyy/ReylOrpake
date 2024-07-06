module.exports.config = {
  name: "facebook",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Replit AI",
  description: "Download Facebook reels and videos",
  commandCategory: "download",
  usages: "[Facebook URL]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");

  try {
      const url = args.join(" ").trim();
      if (!url) {
          return api.sendMessage("Please provide a Facebook URL", event.threadID, event.messageID);
      }
      // Fetch download link from the API
      const { data } = await axios.get(`https://joshweb.click/facebook?url=${encodeURIComponent(url)}`);

      if (data.status === 'error') {
          return api.sendMessage("Invalid Facebook URL or API error", event.threadID, event.messageID);
      }

      const downloadUrl = data.url;

      // Download the video
      const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'utf-8');
      const fileName = downloadUrl.split('/').pop();

      fs.writeFileSync(fileName, buffer);

      // Send the downloaded video
      api.sendMessage({
          attachment: fs.createReadStream(fileName)
      }, event.threadID, event.messageID);

      // Clean up the downloaded file
      fs.unlinkSync(fileName);
  } catch (error) {
      console.error("Error downloading Facebook media:", error.message);
      api.sendMessage("An error occurred while downloading. Please try again later.", event.threadID, event.messageID);
  }
};