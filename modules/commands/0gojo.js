const axios = require("axios");

module.exports.config = {
  name: "gojo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Fetches responses from the Gojo API.",
  commandCategory: "general",
  usages: "gojo [query]",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event }) {
  const { body } = event;
  const trigger = ["gojo", "Gojo"];

  // Check if the event body matches the triggers
  if (trigger.includes(body)) {
    const query = encodeURIComponent(""); // Empty query or customize if needed
    const apiUrl = `https://joshweb.click/pai/gojo?q=${query}&uid=${event.senderID}`;

    try {
      const response = await axios.get(apiUrl);
      const { data } = response;

      // Check if response is found
      if (!data || !data.response) {
        return api.sendMessage("No response found for the query.", event.threadID, event.messageID);
      }

      // Send the response
      api.sendMessage(data.response, event.threadID);
    } catch (error) {
      console.error("Error fetching response:", error);
      api.sendMessage("An error occurred while fetching response. Please try again later.", event.threadID, event.messageID);
    }
  }
};
