const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Query GPT-4 API for responses.",
    commandCategory: "general",
    usages: ["ai [prompt]"],
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const prompt = args.join(' '); // Join arguments to form the prompt

    if (!prompt) {
        return api.sendMessage("Please provide a prompt to query GPT-4 API.", threadID, messageID);
    }

    try {
        const response = await axios.get(`https://joshweb.click/new/gpt-4_adv?prompt=${encodeURIComponent(prompt)}`);
        
        if (response.data) {
            const answer = response.data;
            return api.sendMessage(answer, threadID, messageID);
        } else {
            return api.sendMessage("Sorry, I couldn't get a response from the GPT-4 API.", threadID, messageID);
        }
    } catch (error) {
        console.error("Error fetching from GPT-4 API:", error);
        return api.sendMessage("An error occurred while querying GPT-4 API.", threadID, messageID);
    }
};
