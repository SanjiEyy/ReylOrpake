const axios = require("axios");

module.exports.config = {  
  name: "blackboxai",  
  version: "1.0.0",  
  hasPermssion: 0,  
  credits: "Priyansh Rajput",  
  description: "BlackBoxAi by Priyansh",  
  commandCategory: "ai",  
  usages: "[ask]",  
  cooldowns: 2,  
  dependencies: { "axios": "1.4.0" }  
};  
  
module.exports.run = async function ({ api, event, args, Users }) {  
  const { threadID, messageID, body } = event;  
  const query = encodeURIComponent(args.join(" "));  
  var name = await Users.getNameUser(event.senderID);  
  
  // Check if the message starts with "Ai" (case-insensitive)  
  if (body.toLowerCase().startsWith("ai ")) {  
    const query = body.slice(3); // Remove the "Ai " prefix  
    api.sendMessage("Searching for an answer, please wait...", threadID, messageID);  
    try {  
      api.setMessageReaction("⌛", messageID, () => {}, true);  
      const res = await axios.get(`https://priyansh-ai.onrender.com/api/blackboxai?query=${encodeURIComponent(query)}`);  
      const data = res.data.priyansh;  
      api.sendMessage(data, threadID, messageID);  
      api.setMessageReaction("✅", messageID, () => {}, true);  
    } catch (error) {  
      console.error('Error fetching data', error);  
      api.sendMessage("An error occurred while fetching data. Please try again later.", threadID, messageID);  
      api.setMessageReaction("❌", messageID, () => {}, true);  
    }  
  }  
};  
