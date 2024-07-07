const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "dlfb",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Download and send a video from a Facebook video or reel.",
    commandCategory: "media",
    usages: [],
    cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID, body } = event;

    // Check if the message contains a valid Facebook video or reel URL
    const regex = /(https:\/\/(?:www\.)?facebook\.com\/(?:.*\/)?(?:videos?|watch|posts?)\/\d+)|(https:\/\/(?:www\.)?facebook\.com\/(?:.*\/)?reel\/\d+)/gi;
    const match = body.match(regex);

    if (!match) {
        return api.sendMessage("Please provide a valid Facebook video or reel URL.", threadID, messageID);
    }

    const videoURL = match[0];

    try {
        // Fetch the video data using the provided API endpoint
        const response = await axios.get(`https://joshweb.click/api/fbdl2?url=${encodeURIComponent(videoURL)}`, {
            responseType: 'arraybuffer' // Ensure response is treated as binary data
        });

        // Generate a unique filename based on the sender's ID and current timestamp
        const fileName = `${senderID}_${Date.now()}.mp4`;
        const filePath = path.join(__dirname, fileName);

        // Write the downloaded video data to a local file
        fs.writeFileSync(filePath, response.data);

        // Send the downloaded video as a message attachment
        const message = {
            body: "Here's the video you requested:",
            attachment: fs.createReadStream(filePath)
        };

        // Send the message with the video attachment
        api.sendMessage(message, threadID, () => {
            // Clean up: delete the downloaded video file after sending
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error("Error downloading or sending video:", error);
        api.sendMessage("An error occurred while processing your request. Please try again later.", threadID, messageID);
    }
};
