const { createCanvas, loadImage } = require('canvas');
const { join } = require('path');
const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "survive",
    version: "1.0.0",
    credits: "YourName",
    description: "Play a buckshot roulette game.",
    commandCategory: "games",
    usages: ["!survive - Play a buckshot roulette game."],
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;

    // Load the gun image
    const gunImageUrl = 'https://example.com/gun_image.jpg'; // Replace with your gun image URL
    const gunResponse = await axios.get(gunImageUrl, { responseType: 'arraybuffer' });
    const gunImageBuffer = Buffer.from(gunResponse.data, 'binary');

    // Load the barrel image
    const barrelImageUrl = 'https://example.com/barrel_image.jpg'; // Replace with your barrel image URL
    const barrelResponse = await axios.get(barrelImageUrl, { responseType: 'arraybuffer' });
    const barrelImageBuffer = Buffer.from(barrelResponse.data, 'binary');

    // Create canvas
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');

    // Draw the barrel and gun
    const gunImage = await loadImage(gunImageBuffer);
    const barrelImage = await loadImage(barrelImageBuffer);
    ctx.drawImage(barrelImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(gunImage, 240, 160, 120, 80); // Adjust position and size as needed

    // Randomly determine if the gun fires
    const isShotFired = Math.random() < 0.5; // Adjust probability as needed

    if (isShotFired) {
        api.sendMessage({
            body: '',
            attachment: fs.createReadStream(canvas.toBuffer())
        }, threadID, messageID);
        api.sendMessage(`🔫 Bang! You're dead!`, threadID);
    } else {
        api.sendMessage({
            body: '',
            attachment: fs.createReadStream(canvas.toBuffer())
        }, threadID, messageID);
        api.sendMessage(`🔫 Click! You survived!`, threadID);
    }
};
