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
  usages: "approve, approve all, approve remove all",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const command = args[0];

  // Load the approved threads list
  let approvedThreads = [];
  if (fs.existsSync(approvalFilePath)) {
    approvedThreads = JSON.parse(fs.readFileSync(approvalFilePath, "utf8"));
  }

  if (command === "all") {
    if (!global.config.ADMINBOT.includes(senderID)) {
      return api.sendMessage("Only admins can approve all group chats for the bot.", threadID, messageID);
    }

    // Fetch all group chats where the bot is currently active
    const threadList = await api.getThreadList(100, null, ["INBOX", "PENDING"]);

    threadList.forEach(thread => {
      if (!approvedThreads.includes(thread.threadID)) {
        approvedThreads.push(thread.threadID);
      }
    });

    fs.writeFileSync(approvalFilePath, JSON.stringify(approvedThreads, null, 2));

    api.sendMessage("All group chats have been approved for bot interaction.", threadID, messageID);
  } else if (command === "remove" && args[1] === "all") {
    if (!global.config.ADMINBOT.includes(senderID)) {
      return api.sendMessage("Only admins can remove approval from all group chats for the bot.", threadID, messageID);
    }

    // Clear the approved threads list
    approvedThreads = [];
    fs.writeFileSync(approvalFilePath, JSON.stringify(approvedThreads, null, 2));

    api.sendMessage("Approval removed from all group chats for bot interaction.", threadID, messageID);
  } else {
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
  }
};
