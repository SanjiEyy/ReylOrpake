const fs = require("fs");
const path = require("path");

const approvalFilePath = path.resolve(__dirname, "approvedThreads.json");
const adminThreadID = "7729634530417299";

module.exports.config = {
  name: "noapproval",
  version: "1.0.0",
  hasPermssion: 2, // Only admins can approve the bot
  credits: "ChatGPT",
  description: "Requires admin approval for the bot to respond in new group chats.",
  commandCategory: "system",
  usages: "[approve | revoke]",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID } = event;

  // Load the approved threads list
  let approvedThreads = [];
  if (fs.existsSync(approvalFilePath)) {
    approvedThreads = JSON.parse(fs.readFileSync(approvalFilePath, "utf8"));
  }

  // Check if the thread is approved
  if (!approvedThreads.includes(threadID)) {
    // Notify admin for approval
    api.sendMessage(
      `A new group chat needs approval:\nThread ID: ${threadID}\nTo approve, use the command: ${global.config.PREFIX}approve ${threadID}`,
      adminThreadID
    );
    return;
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  if (args[0] === "approve") {
    if (!global.config.ADMINBOT.includes(senderID)) {
      return api.sendMessage("Only admins can approve the bot in this group chat.", threadID, messageID);
    }

    // Load the approved threads list
    let approvedThreads = [];
    if (fs.existsSync(approvalFilePath)) {
      approvedThreads = JSON.parse(fs.readFileSync(approvalFilePath, "utf8"));
    }

    // Add the thread to the approved list
    if (!approvedThreads.includes(threadID)) {
      approvedThreads.push(threadID);
      fs.writeFileSync(approvalFilePath, JSON.stringify(approvedThreads, null, 2));
      api.sendMessage("This group chat has been approved. The bot will now respond to messages.", threadID, messageID);
    } else {
      api.sendMessage("This group chat is already approved.", threadID, messageID);
    }
  } else if (args[0] === "revoke") {
    if (!global.config.ADMINBOT.includes(senderID)) {
      return api.sendMessage("Only admins can revoke the bot in this group chat.", threadID, messageID);
    }

    // Load the approved threads list
    let approvedThreads = [];
    if (fs.existsSync(approvalFilePath)) {
      approvedThreads = JSON.parse(fs.readFileSync(approvalFilePath, "utf8"));
    }

    // Remove the thread from the approved list
    if (approvedThreads.includes(threadID)) {
      approvedThreads = approvedThreads.filter(id => id !== threadID);
      fs.writeFileSync(approvalFilePath, JSON.stringify(approvedThreads, null, 2));
      api.sendMessage("This group chat has been revoked. The bot will no longer respond to messages.", threadID, messageID);
    } else {
      api.sendMessage("This group chat is not approved.", threadID, messageID);
    }
  } else {
    api.sendMessage("Invalid command. Use 'approve' to approve the bot or 'revoke' to revoke the bot.", threadID, messageID);
  }
};
