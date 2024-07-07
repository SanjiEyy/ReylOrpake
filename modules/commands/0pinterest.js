const axios = require('axios');

module.exports.config = {
    name: "pinterest",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Search for images on Pinterest.",
    commandCategory: "general",
    usages: ["pinterest [query]"],
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const query = args.join(' ');

    if (!query) {
        return api.sendMessage("Please provide a search query.", threadID, messageID);
    }

    try {
        const response = await axios.get(`https://joshweb.click/api/pinterest?q=${encodeURIComponent(query)}`);
        
        if (response.data.status === 200 && response.data.result) {
            const images = response.data.result;
            let message = `Here are the top images related to "${query}":\n\n`;
            
            images.forEach((image, index) => {
                message += `${index + 1}. ${image.description}\n${image.url}\n\n`;
            });

            return api.sendMessage(message.trim(), threadID, messageID);
        } else {
            return api.sendMessage(`No images found for "${query}".`, threadID, messageID);
        }
    } catch (error) {
        console.error("Error fetching from Pinterest API:", error);
        return api.sendMessage("An error occurred while querying Pinterest API.", threadID, messageID);
    }
};
