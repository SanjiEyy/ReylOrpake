const { createCanvas, loadImage } = require('canvas');
const { join } = require('path');
const fs = require('fs-extra');
const axios = require('axios');

module.exports.config = {
    name: "burn",
    version: "1.0.0",
    credits: "YourName",
    description: "Burn someone's picture on the paper Spongebob is holding.",
    commandCategory: "fun",
    usages: ["!burn @mention - Burn the mentioned user's picture."],
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "path": "",
        "axios": ""
    }
};

module.exports.run = async function({ api, event, Users }) {
    const { threadID, messageID, senderID, mentions } = event;

    if (Object.keys(mentions).length === 0) {
        api.sendMessage("Please tag someone to burn their picture.", threadID, messageID);
        return;
    }

    try {
        const taggedUserID = Object.keys(mentions)[0];
        const taggedUserName = mentions[taggedUserID].replace(/@/g, "");
        const senderName = await Users.getNameUser(senderID);

        // Load images
        const baseImageUrl = 'https://i.postimg.cc/ZKjhsnYJ/images-1.jpg';
        const response = await axios.get(baseImageUrl, { responseType: 'arraybuffer' });
        const baseImageBuffer = Buffer.from(response.data, 'binary');
        const baseImage = await loadImage(baseImageBuffer);

        const profileImageUrl = `https://graph.facebook.com/${taggedUserID}/picture?type=large`;
        const profileResponse = await axios.get(profileImageUrl, { responseType: 'arraybuffer' });
        const profileImageBuffer = Buffer.from(profileResponse.data, 'binary');
        const profileImage = await loadImage(profileImageBuffer);

        // Create canvas
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');

        // Draw base image
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

        // Draw profile image on the paper
        const paperX = -200; // Adjust x position
        const paperY = 300; // Adjust y position
        const paperWidth = 50; // Adjust width
        const paperHeight = 50; // Adjust height
        ctx.drawImage(profileImage, paperX, paperY, paperWidth, paperHeight);

        // Add text
        ctx.font = '20px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(`${senderName} cocks ${taggedUserName}`, 50, canvas.height - 20);

        // Save image
        const filePath = join(__dirname, 'cache', 'burned_image.png');
        const out = fs.createWriteStream(filePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        out.on('finish', () => {
            api.sendMessage({
                body: '',
                attachment: fs.createReadStream(filePath)
            }, threadID, () => fs.unlinkSync(filePath), messageID);
        });

    } catch (error) {
        console.error("Error creating burn image:", error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
};
