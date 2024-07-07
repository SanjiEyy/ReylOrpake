const fetch = require('node-fetch');
const fs = require('fs-extra');
const { join } = require('path');

module.exports.config = {
    name: "emi",
    version: "1.0.0",
    credits: "YourName",
    description: "Fetch and send an image from the EMI API",
    commandCategory: "general",
    usages: "emi <prompt>",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "path": "",
        "node-fetch": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
        return api.sendMessage("Please provide a prompt for the image.", event.threadID, event.messageID);
    }

    const apiUrl = `https://joshweb.click/emi?prompt=${encodeURIComponent(prompt)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const buffer = await response.buffer();
        const filePath = join(__dirname, 'cache', `${Date.now()}.jpg`);
        
        await fs.writeFile(filePath, buffer);

        api.sendMessage({
            body: `Here is an image for the prompt: "${prompt}"`,
            attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
            fs.unlinkSync(filePath);
        }, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("Sorry, an error occurred while fetching the image.", event.threadID, event.messageID);
    }
};
