const { createCanvas, loadImage } = require('canvas');
const { join } = require('path');
const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "lifeordeath",
    version: "1.0.0",
    credits: "YourName",
    description: "Play a gamble of life game.",
    commandCategory: "games",
    usages: ["!lifeordeath - Play the gamble of life game."],
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;

    // Roll dice for player and auto player
    const playerDice = Math.floor(Math.random() * 6) + 1;
    const autoPlayerDice = Math.floor(Math.random() * 6) + 1;

    // Determine winner
    let isPlayerAlive = playerDice > autoPlayerDice;

    // Prepare canvas and images
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    // Load images (dice images or any suitable images)
    const playerDiceImageUrl = 'https://example.com/player_dice_image.png'; // Replace with your player dice image URL
    const autoPlayerDiceImageUrl = 'https://example.com/auto_player_dice_image.png'; // Replace with your auto player dice image URL

    const [playerDiceImageBuffer, autoPlayerDiceImageBuffer] = await Promise.all([
        axios.get(playerDiceImageUrl, { responseType: 'arraybuffer' }),
        axios.get(autoPlayerDiceImageUrl, { responseType: 'arraybuffer' })
    ]);

    const playerDiceImage = await loadImage(Buffer.from(playerDiceImageBuffer.data, 'binary'));
    const autoPlayerDiceImage = await loadImage(Buffer.from(autoPlayerDiceImageBuffer.data, 'binary'));

    // Draw images on canvas
    ctx.drawImage(playerDiceImage, 50, 50, 100, 100); // Adjust position and size as needed
    ctx.drawImage(autoPlayerDiceImage, 250, 50, 100, 100); // Adjust position and size as needed

    // Send canvas image
    const canvasBuffer = canvas.toBuffer();
    const canvasStream = fs.createReadStream(canvasBuffer);

    api.sendMessage({
        body: '',
        attachment: canvasStream
    }, threadID, messageID);

    // Determine game result and send message
    if (isPlayerAlive) {
        api.sendMessage(`You rolled a ${playerDice} and the auto player rolled a ${autoPlayerDice}. You survived! 🎲`, threadID);
    } else {
        // Ban bot for 1 hour (simulated action)
        const banDurationHours = 1;
        const banMessage = `You rolled a ${playerDice} and the auto player rolled a ${autoPlayerDice}. You didn't survive and are banned for ${banDurationHours} hour(s). 🎲`;
        api.sendMessage(banMessage, threadID);

        // Simulate banning action (replace with actual banning mechanism if integrated with platform's ban system)
        setTimeout(() => {
            api.sendMessage(`Your ban of ${banDurationHours} hour(s) has expired. You can play again now.`, threadID);
        }, banDurationHours * 60 * 60 * 1000); // Convert hours to milliseconds
    }
};
