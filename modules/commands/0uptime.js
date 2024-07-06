const fs = require("fs");
const moment = require("moment");
const path = require("path");

module.exports.config = {
  name: "uptime",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Shows how long the bot has been running and displays a cached GIF.",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
};

module.exports.run = function({ api, event }) {
  // Calculate uptime
  const uptime = moment.duration(process.uptime() * 1000).humanize();

  // Fetch and send cached GIF
  const gifPath = path.resolve(__dirname, "cache", "uptime.gif"); // Replace with your actual cache path
  if (!fs.existsSync(gifPath)) {
    return api.sendMessage("Cached GIF not found.", event.threadID, event.messageID);
  }

  // Send message with uptime and GIF
  api.sendMessage({
    body: `Bot Uptime: ${uptime}\n\n[Attachment]`,
    attachment: fs.createReadStream(gifPath),
  }, event.threadID, () => {
    fs.unlinkSync(gifPath); // Delete the file after sending
  });
};
