const axios = require('axios');
const fs = require('fs');
const request = require('request');
const { createWriteStream, unlinkSync } = require('fs');
const { join } = require('path');

module.exports.config = {
    name: "shoti",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Send a TikTok video from Shoti API.",
    commandCategory: "media",
    usages: ["Reply with !shoti to send a TikTok video."],
    cooldowns: 28,
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;

    try {
        // Message to indicate video fetching
        const msg1 = {
            body: "Sending TikTok video... 😘"
        };

        // API URL to fetch TikTok video
        const apiUrl = "https://shoti-srv1.onrender.com/api/v1/get";

        // Make POST request to fetch TikTok video URL
        const { data } = await axios.post(apiUrl, {
            apikey: "$shoti-1ho3b41uiohngdbrgk8",
        });

        // Destructure relevant information from the response data
        const { url: videoUrl, user: { username, nickname } } = data.data;

        // Create a writable stream to save the video locally
        const videoFileName = `${senderID}_${Date.now()}.mp4`;
        const videoFilePath = join(__dirname, 'cache', videoFileName);

        // Download the video from the fetched URL and save it locally
        await new Promise((resolve, reject) => {
            const rqs = request(encodeURI(videoUrl));
            const videoStream = fs.createWriteStream(videoFilePath);
            rqs.pipe(videoStream);
            rqs.on('end', resolve);
            rqs.on('error', reject);
        });

        // Message to send with the TikTok video
        const msg2 = {
            body: `TikTok User: ${username} (${nickname})`,
            attachment: fs.createReadStream(videoFilePath)
        };

        // Send initial message indicating video is being sent
        api.sendMessage(msg1, threadID, messageID);

        // Delay sending the video to simulate processing
        setTimeout(() => {
            api.sendMessage(msg2, threadID);
            // Clean up: delete the downloaded video file after sending
            unlinkSync(videoFilePath);
        }, 2000);

    } catch (error) {
        console.error(error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
};
