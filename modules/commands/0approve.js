const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

const approvalFilePath = path.resolve(__dirname, "approvedThreads.json");

module.exports.config = {
  name: "approve",
  version: "1.0.0",
  hasPermssion: 2, // Only admins can approve the bot
  credits: "ChatGPT",
  description: "Approves group chats for bot interaction.",
  commandCategory: "system",
  usages: "approve",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  // Load the approved threads list
  let approvedThreads = [];
  if (fs.existsSync(approvalFilePath)) {
    approvedThreads = JSON.parse(fs.readFileSync(approvalFilePath, "utf8"));
  }

  // Check if the thread is already approved
  if (!approvedThreads.includes(threadID)) {
    if (!global.config.ADMINBOT.includes(senderID)) {
      return api.sendMessage("Only admins can approve the bot in this group chat.", threadID, messageID);
    }

    // Add the thread to the approved list
    approvedThreads.push(threadID);
    fs.writeFileSync(approvalFilePath, JSON.stringify(approvedThreads, null, 2));

    // Send a message to the group chat indicating the bot is now approved
    const dateTime = moment.tz("Asia/Manila").format("MMMM Do YYYY, h:mm:ss a");
    const adminMessage = `Hey admin, this group chat has been approved by Hung Sai Shing.\nDate and Time: ${dateTime}\n\nAdmin Facebook: www.facebook.com/100080008820985`;

    api.sendMessage(adminMessage, threadID, messageID);
  } else {
    api.sendMessage("This group chat is already approved.", threadID, messageID);
  }
};
