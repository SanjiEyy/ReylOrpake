const axios = require('axios');
const { createWriteStream, unlinkSync } = require('fs');
const { join } = require('path');

module.exports.config = {
    name: "enhance",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Enhance an image using the ReMini API.",
    commandCategory: "media",
    usages: ["Reply with !enhance to an image you want to enhance."],
    cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID, attachments } = event;

    // Check if the message has attachments (i.e., an image reply)
    if (!attachments.length > 0) {
        return api.sendMessage("Please reply to an image to enhance it.", threadID, messageID);
    }

    // Extract the image URL from the attachment
    const imageURL = attachments[0].url;

    try {
        // Fetch image enhancement using the provided ReMini API endpoint
        const response = await axios.get(`https://joshweb.click/remini?q=${encodeURIComponent(imageURL)}`, {
            responseType: 'stream' // Ensure response is treated as a readable stream
        });

        // Generate a unique filename based on the sender's ID and current timestamp
        const fileName = `${senderID}_${Date.now()}.jpg`;
        const filePath = join(__dirname, fileName);

        // Pipe the stream directly to a file
        response.data.pipe(createWriteStream(filePath));

        // Wait until the file is fully written
        await new Promise((resolve, reject) => {
            response.data.on('end', resolve);
            response.data.on('error', reject);
        });

        // Send the enhanced image as a message attachment
        const message = {
            body: "Here's the enhanced image you requested:",
            attachment: createReadStream(filePath)
        };

        // Send the message with the enhanced image attachment
        api.sendMessage(message, threadID, () => {
            // Clean up: delete the downloaded image file after sending
            unlinkSync(filePath);
        });
    } catch (error) {
        console.error("Error enhancing image:", error);
        api.sendMessage("An error occurred while processing your request. Please try again later.", threadID, messageID);
    }
};
