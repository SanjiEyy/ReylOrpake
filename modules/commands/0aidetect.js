const axios = require('axios');

module.exports.config = {
    name: "aidetect",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Detect attributes or characteristics of text using an AI API.",
    commandCategory: "general",
    usages: ["aidetect [text]"],
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const text = args.join(' ');

    if (!text) {
        return api.sendMessage("Please provide text to analyze using AI detection.", threadID, messageID);
    }

    try {
        // Fetch AI detection data from the provided API endpoint
        const response = await axios.get(`https://joshweb.click/ai-detect?q=${encodeURIComponent(text)}`);

        if (response.data) {
            const detectionResult = response.data;
            const message = `
            Detected Text: ${text}
            Attributes Detected: ${detectionResult.attributes.join(', ')}
            Confidence Level: ${detectionResult.confidence}
            `;

            return api.sendMessage(message, threadID, messageID);
        } else {
            return api.sendMessage("Sorry, I couldn't detect attributes for the provided text.", threadID, messageID);
        }
    } catch (error) {
        console.error("Error detecting attributes:", error);
        return api.sendMessage("An error occurred while detecting attributes. Please try again later.", threadID, messageID);
    }
};
