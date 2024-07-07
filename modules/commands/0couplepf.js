const axios = require('axios');

module.exports.config = {
    name: "couplepf",
    version: "1.0.0",
    credits: "YourName",
    description: "Fetches a couple profile picture using the CoupleD API.",
    commandCategory: "fun",
    usages: ["!coupledl - Fetches a couple profile picture."],
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;

    const apiUrl = "https://global-sprak.onrender.com/api/cdp";

    try {
        const response = await axios.get(apiUrl);
        const imageUrl = response.data.image; // Assuming the API returns an object with an 'image' property

        // Send the image as an attachment
        api.sendMessage({ attachment: axios.get(imageUrl, { responseType: 'arraybuffer' }), body: "" }, threadID, messageID);
    } catch (error) {
        console.error("Error fetching couple profile picture:", error);
        api.sendMessage(`Failed to fetch couple profile picture. Please try again later.`, threadID, messageID);
    }
};
