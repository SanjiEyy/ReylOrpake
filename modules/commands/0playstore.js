const axios = require('axios');

module.exports.config = {
    name: "playstore",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Searches for an app on the Google Play Store.",
    commandCategory: "general",
    usages: ["playstore [app name]"],
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const appName = args.join(' ');

    if (!appName) {
        return api.sendMessage("Please provide an app name to search on the Google Play Store.", threadID, messageID);
    }

    try {
        // Fetch app data from the provided API endpoint
        const response = await axios.get(`https://joshweb.click/api/playstore?q=${encodeURIComponent(appName)}`);

        if (response.data) {
            const appInfo = response.data;
            const message = `
            App Name: ${appInfo.title}
            Developer: ${appInfo.developer}
            Price: ${appInfo.price}
            Rating: ${appInfo.rating}
            Description: ${appInfo.description}
            `;

            return api.sendMessage(message, threadID, messageID);
        } else {
            return api.sendMessage("Sorry, I couldn't find information for that app.", threadID, messageID);
        }
    } catch (error) {
        console.error("Error fetching app information:", error);
        return api.sendMessage("An error occurred while fetching app information. Please try again later.", threadID, messageID);
    }
};
