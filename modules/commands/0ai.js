const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",//thanks
  description: "Fetches responses from the GPT-4 API with custom replay AI name and responds with Asia/Manila timezone.",
  commandCategory: "general",
  usages: "ai [prompt]",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
  const { body } = event;

  // Check if the message is not from the bot itself
  if (event.senderID !== api.getCurrentUserID()) {
    const prompt = encodeURIComponent(body.trim()); // Encode entire message as prompt
    const apiUrl = `https://joshweb.click/new/gpt-4_adv?prompt=${prompt}`;

    try {
      const response = await axios.get(apiUrl);
      const { data } = response;

      // Check if response is found
      if (!data || !data.response) {
        return api.sendMessage("No response found for the query.", event.threadID, event.messageID);
      }

      // Get current date and time in Asia/Manila timezone
      const now = moment().tz("Asia/Manila");
      const currentDate = now.format("YYYY-MM-DD");
      const currentTime = now.format("HH:mm:ss");
      const currentDay = now.format("dddd");

      // Construct the AI's response with date, time, day, and AI name
      const aiName = "Your AI Name"; // Replace with your AI's name
      const fullResponse = `[${aiName}] ${data.response}\nDate: ${currentDate}\nTime: ${currentTime}\nDay: ${currentDay}`;

      // Send the response
      api.sendMessage(fullResponse, event.threadID);
    } catch (error) {
      console.error("Error fetching response:", error);
      api.sendMessage("An error occurred while fetching response. Please try again later.", event.threadID, event.messageID);
    }
  }
};
