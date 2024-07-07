const axios = require('axios');

module.exports.config = {
    name: "tempmail",
    version: "1.0.0",
    credits: "YourName",
    description: "Generates a temporary email address.",
    commandCategory: "fun",
    usages: ["!tempmail - Generates a temporary email address."],
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const apiUrl = "https://global-sprak.onrender.com/api/tempmail/get";

    try {
        const response = await axios.get(apiUrl);
        const tempEmail = response.data.email; // Assuming the API returns an object with an 'email' property

        api.sendMessage(`Here is your temporary email address:\n\n${tempEmail}`, threadID, messageID);
    } catch (error) {
        console.error("Error fetching temporary email address:", error);
        api.sendMessage(`Failed to generate temporary email address. Please try again later.`, threadID, messageID);
    }
};
