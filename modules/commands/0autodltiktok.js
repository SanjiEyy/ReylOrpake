const axios = require("axios");
const fs = require("fs");
const { resolve } = require("path");

module.exports.config = {
  name: "tiktokdl",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Auto downloads TikTok videos from provided URLs.",
  commandCategory: "media",
  usages: "[TikTok URL]",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
  const { body, threadID, messageID } = event;

  // Regex to check if the message contains a TikTok URL
  const tiktokUrlRegex = /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com\/(?:.*\bvideo\/|.*\buser\/.*\bvideo\/|.*\buser\/.*\b))(\d+)/;

  if (!tiktokUrlRegex.test(body)) return;

  const urlMatch = body.match(tiktokUrlRegex);
  if (!urlMatch || !urlMatch[0]) return;

  const tiktokUrl = urlMatch[0];
  const apiUrl = `https://joshweb.click/tiktokdl?url=${encodeURIComponent(tiktokUrl)}`;

  try {
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    const videoBuffer = Buffer.from(response.data, "binary");

    // Save the video to a temporary file
    const videoPath = resolve(__dirname, "cache", "tiktok_video.mp4");
    fs.writeFileSync(videoPath, videoBuffer);

    // Send the video
    api.sendMessage(
      {
        body: "Here is your TikTok video:",
        attachment: fs.createReadStream(videoPath),
      },
      threadID,
      () => {
        // Delete the temporary video file after sending
        fs.unlinkSync(videoPath);
      },
      messageID
    );
  } catch (error) {
    console.error("Error fetching video:", error);
    api.sendMessage("An error occurred while fetching the TikTok video. Please try again later.", threadID, messageID);
  }
};

module.exports.run = function({ api, event, args }) {
  // This function is required but not used since the script is triggered by any message containing a TikTok URL
};
