const fs = require("fs");
const { MessageAttachment } = require("facebook-chat-api");
const moment = require("moment-timezone");

const approvalFilePath = "./approvedThreads.json"; // Adjust the path as needed

module.exports.config = {
  name: "autofriendacp",
  version: "1.0.0",
  hasPermssion: 2, // Only admins can configure this command
  credits: "ChatGPT",
  description: "Automatically accepts friend requests and sends a greeting sticker based on time of day.",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
};

// Define an array of sticker numbers (you can add more if needed)
const stickerNumbers = [369239383222688, 369239383222689, 369239383222690];

module.exports.handleEvent = async function({ api, event }) {
  const { type, threadID, senderID } = event;

  if (type !== "message") return;

  if (event.isGroup) {
    // Check if the bot is added in a group
    let approvedThreads = [];
    if (fs.existsSync(approvalFilePath)) {
      approvedThreads = JSON.parse(fs.readFileSync(approvalFilePath, "utf8"));
    }

    if (!approvedThreads.includes(threadID)) {
      return api.sendMessage("Please add me to your group chat for interaction.", threadID);
    }
  }

  if (event.isFriendRequest) {
    // Automatically accept friend request
    api.handleMessageRequest(senderID, true, (err) => {
      if (err) console.error("Error accepting friend request:", err);

      // Get current hour in Asia/Manila timezone
      const now = moment().tz("Asia/Manila");
      const hour = now.hour();

      // Determine the appropriate greeting based on the time of day
      let greeting;
      if (hour >= 5 && hour < 12) {
        greeting = "Good morning!";
      } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon!";
      } else if (hour >= 17 && hour < 20) {
        greeting = "Good evening!";
      } else {
        greeting = "Good night!";
      }

      // Format the current date and time
      const formattedDateTime = now.format("dddd, MMMM D, YYYY [at] HH:mm:ss");

      // Compose the greeting message
      const message = `Hey, thank you for sending me a friend request! If you need anything, feel free to ask. Please add me to any group chats for further interaction.\n\nCurrent time in Asia/Manila: ${formattedDateTime}\n\n${greeting}`;

      // Get a random sticker number from the array
      const randomStickerNumber = stickerNumbers[Math.floor(Math.random() * stickerNumbers.length)];

      // Send the sticker and the greeting message
      api.sendMessage({ body: message, sticker: randomStickerNumber }, senderID);
    });
  }
};

module.exports.run = function({ api, event, args }) {
  // This command doesn't require any run logic since it's event-driven
};
