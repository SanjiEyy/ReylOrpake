const axios = require('axios');

module.exports.config = {
    name: "emi",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Generate an image based on a prompt using the EMI API.",
    commandCategory: "image",
    usages: ["emi [prompt]"],
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const prompt = args.join(' ');

    if (!prompt) {
        return api.sendMessage("Please provide a prompt to generate an image.", threadID, messageID);
    }

    try {
        // Fetch image data from the provided API endpoint
        const response = await axios.get(`https://joshweb.click/emi?prompt=${encodeURIComponent(prompt)}`, {
            responseType: 'arraybuffer' // Ensure response is treated as binary data
        });

        if (response.data) {
            // Convert image data to base64
            const imageData = Buffer.from(response.data, 'binary').toString('base64');

            // Send the generated image as a message attachment
            const message = {
                body: `Image generated based on "${prompt}"`,
                attachment: imageData,
                type: 'image'
            };

            return api.sendMessage(message, threadID, messageID);
        } else {
            return api.sendMessage("Sorry, I couldn't generate an image based on the provided prompt.", threadID, messageID);
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return api.sendMessage("An error occurred while generating the image. Please try again later.", threadID, messageID);
    }
};
