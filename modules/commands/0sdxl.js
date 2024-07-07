const axios = require('axios');

module.exports.config = {
    name: "sdxl",
    version: "1.0.0",
    credits: "YourName",
    description: "Generates text based on the given prompt using SDXL API with style selection.",
    commandCategory: "fun",
    usages: ["!sdxl <prompt> <style> - Generates text based on the provided prompt with the specified style (1 to 50)."],
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args[0]) {
        return api.sendMessage("Please provide a prompt and a style number (1-50).", threadID, messageID);
    }

    let prompt = encodeURIComponent(args.slice(0, -1).join(" "));
    let style = parseInt(args[args.length - 1]);

    if (isNaN(style) || style < 1 || style > 50) {
        return api.sendMessage("Style number must be between 1 and 50.", threadID, messageID);
    }

    const apiUrl = `https://global-sprak.onrender.com/api/sdxl?prompt=${prompt}&model=${style}`;

    try {
        const response = await axios.get(apiUrl);
        const generatedText = response.data;

        api.sendMessage(generatedText, threadID, messageID);
    } catch (error) {
        console.error("Error fetching from SDXL API:", error);
        api.sendMessage(`Failed to generate text. Please try again later.`, threadID, messageID);
    }
};
