const axios = require('axios');

module.exports.config = {
    name: "sim",
    version: "1.0.0",
    credits: "YourName",
    description: "Interacts with the SIM API using a specified chat message and language.",
    commandCategory: "fun",
    usages: ["!sim <message> - Interacts with the SIM API using the provided message and default language (set by admin)."],
    cooldowns: 5,
    adminOnly: true, // Only admin can change the language parameter
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;

    // Check if admin sets a language parameter
    let lang = "en"; // Default language (can be set by admin)
    if (args[0] && args[0].toLowerCase() === "setlang" && args[1]) {
        if (event.senderID === "admin_user_id_here") { // Replace with actual admin user ID
            lang = args[1].toLowerCase(); // Update language if admin sets it
            return api.sendMessage(`Language set to '${lang}'.`, threadID, messageID);
        } else {
            return api.sendMessage("You are not authorized to change the language.", threadID, messageID);
        }
    }

    // Join remaining arguments as the chat message
    const chatMessage = encodeURIComponent(args.join(" "));
    const apiUrl = `https://global-sprak.onrender.com/api/sim?chat=${chatMessage}&lang=${lang}`;

    try {
        const response = await axios.get(apiUrl);
        const simResponse = response.data;

        api.sendMessage(simResponse, threadID, messageID);
    } catch (error) {
        console.error("Error interacting with SIM API:", error);
        api.sendMessage(`Failed to interact with SIM API. Please try again later.`, threadID, messageID);
    }
};
