const axios = require('axios');

module.exports.config = {
    name: "sdxl",
    version: "1.0.0",
    credits: "YourName",
    description: "Generates text based on the given prompt using SDXL API.",
    commandCategory: "fun",
    usages: ["!sdxl <prompt> - Generates text based on the provided prompt."],
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args[0]) {
        return api.sendMessage("Please provide a prompt.", threadID, messageID);
    }

    const prompt = encodeURIComponent(args.join(" "));
    const apiUrl = `https://global-sprak.onrender.com/api/sdxl?prompt=${prompt}&model=1`;

    try {
        const response = await axios.get(apiUrl);
        const generatedText = response.data;

        api.sendMessage(generatedText, threadID, messageID);
    } catch (error) {
        console.error("Error fetching from SDXL API:", error);
        api.sendMessage(`Failed to generate text. Please try again later.`, threadID, messageID);
    }
};
