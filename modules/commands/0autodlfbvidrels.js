const axios = require("axios");
const fs = require("fs");
const { resolve } = require("path");

module.exports.config = {
  name: "autodlfbvidrels",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Auto downloads Facebook reels or videos from provided URLs.",
  commandCategory: "media",
  usages: "[Facebook URL]",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
  const { body, threadID, messageID } = event;

  // Regex to check if the message contains a Facebook URL
  const fbUrlRegex = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com\/(?:.*\bvideos\/|.*\breels\/))/;

  if (!fbUrlRegex.test(body)) return;

  const urlMatch = body.match(fbUrlRegex);
  if (!urlMatch || !urlMatch[0]) return;

  const fbUrl = urlMatch[0];
  const apiUrl = `https://joshweb.click/facebook?url=${encodeURIComponent(fbUrl)}`;

  try {
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    const videoBuffer = Buffer.from(response.data, "binary");

    // Save the video to a temporary file
    const videoPath = resolve(__dirname, "cache", "fb_video.mp4");
    fs.writeFileSync(videoPath, videoBuffer);

    // Send the video
    api.sendMessage(
      {
        body: "Here is your Facebook video:",
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
    api.sendMessage("An error occurred while fetching the Facebook video. Please try again later.", threadID, messageID);
  }
};

module.exports.run = function({ api, event, args }) {
  // This function is required but not used since the script is triggered by any message containing a Facebook URL
};
