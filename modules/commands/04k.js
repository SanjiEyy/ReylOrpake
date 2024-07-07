const axios = require('axios');

module.exports.config = {
    name: "4k",
    version: "1.0.0",
    credits: "YourName",
    description: "Enhances the quality of the replied image to 4K resolution.",
    commandCategory: "fun",
    usages: ["Reply to an image with !4k to enhance its quality to 4K resolution."],
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0 || messageReply.attachments[0].type !== "photo") {
        return api.sendMessage("Please reply to an image to enhance its quality to 4K resolution.", threadID, messageID);
    }

    const imageUrl = messageReply.attachments[0].url;
    const apiUrl = `https://global-sprak.onrender.com/api/4k?url=${encodeURIComponent(imageUrl)}`;

    try {
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];

        api.sendMessage({
            attachment: response.data,
            contentType: contentType,
            name: '4k_image.jpg'
        }, threadID, messageID);
    } catch (error) {
        console.error("Error enhancing image to 4K:", error);
        api.sendMessage(`Failed to enhance image to 4K. Please try again later.`, threadID, messageID);
    }
};
