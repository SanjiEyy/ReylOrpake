const axios = require('axios');

module.exports.config = {
    name: "animex",
    version: "1.0.0",
    credits: "YourName",
    description: "Fetches an anime character image based on the provided prompt.",
    commandCategory: "fun",
    usages: ["!animex <prompt> - Fetches an anime character image based on the provided prompt."],
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args[0]) {
        return api.sendMessage("Please provide a prompt (e.g., 'girl').", threadID, messageID);
    }

    const prompt = encodeURIComponent(args.join(" "));
    const apiUrl = `https://global-sprak.onrender.com/api/animex?prompt=${prompt}`;

    try {
        const response = await axios.get(apiUrl);
        const imageUrl = response.data.image; // Assuming the API returns an object with an 'image' property

        // Send the image as an attachment
        api.sendMessage({ attachment: axios.get(imageUrl, { responseType: 'arraybuffer' }), body: "" }, threadID, messageID);
    } catch (error) {
        console.error("Error fetching anime character image:", error);
        api.sendMessage(`Failed to fetch anime character image. Please try again later.`, threadID, messageID);
    }
};
