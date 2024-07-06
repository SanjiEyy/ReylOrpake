const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
  name: "autosend",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "gpt",
  description: "Automatically sends greetings based on time of day in Asia/Manila timezone.",
  commandCategory: "system",
  usages: "",
  cooldowns: 1,
};

function getGreetingByHour(hour) {
  if (hour >= 5 && hour < 12) {
    return "Good morning everyone!";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon everyone!";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening everyone!";
  } else {
    return "Good night everyone!";
  }
}

async function sendMessage(api, threadID, message) {
  try {
    await api.sendMessage(message, threadID);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  // Initial message send
  const sendInitialMessage = async () => {
    const gio = moment.tz("Asia/Manila").format("HH");
    const greeting = getGreetingByHour(parseInt(gio));
    const message = `${greeting} (Auto-sent by ${global.config.BOTNAME})`;
    await sendMessage(api, event.threadID, message);
  };

  // Schedule the initial message to be sent after 1 hour
  setTimeout(sendInitialMessage, 60 * 60 * 1000);
};

module.exports.run = function({ api, event, client, __GLOBAL }) {
  // This command doesn't need to do anything on run
};
