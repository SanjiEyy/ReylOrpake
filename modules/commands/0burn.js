const { createCanvas, loadImage } = require('canvas');
const { join } = require('path');
const fs = require('fs');

module.exports.config = {
    name: "burn",
    version: "1.0.0",
    credits: "YourName",
    description: "Superimpose the sender's or tagged person's image on SpongeBob's paper.",
    commandCategory: "fun",
    usages: ["!burn - Superimpose the sender's or tagged person's image on SpongeBob's paper."],
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;

    // Check if there's a tagged person in the message
    const taggedUserID = Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : senderID;

    // Function to create the burned image
    const createBurnedImage = async (userID) => {
        try {
            // Load SpongeBob's paper image and the user's profile picture
            const spongebobPaper = await loadImage('https://i.postimg.cc/ZKjhsnYJ/images-1.jpg');
            const userImage = await loadImage(`https://graph.facebook.com/${userID}/picture?type=large`);

            // Create a canvas matching SpongeBob's paper dimensions
            const canvas = createCanvas(spongebobPaper.width, spongebobPaper.height);
            const ctx = canvas.getContext('2d');

            // Draw SpongeBob's paper image on the canvas
            ctx.drawImage(spongebobPaper, 0, 0, canvas.width, canvas.height);

            // Resize and position the user's image on SpongeBob's paper
            const imageSize = 200; // Adjust size as needed
            const x = 100; // Adjust position as needed
            const y = 300; // Adjust position as needed
            ctx.drawImage(userImage, x, y, imageSize, imageSize);

            // Save the modified canvas to a file
            const filePath = join(__dirname, 'burned_image.png');
            const out = fs.createWriteStream(filePath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);

            return new Promise((resolve, reject) => {
                out.on('finish', () => resolve(filePath));
                out.on('error', (err) => reject(err));
            });
        } catch (error) {
            throw new Error(`Error creating burned image: ${error.message}`);
        }
    };

    try {
        const filePath = await createBurnedImage(taggedUserID);

        // Send the modified image as an attachment
        api.sendMessage({
            body: "Here's your burned image!",
            attachment: fs.createReadStream(filePath)
        }, threadID, messageID);

        // Clean up: Delete the temporary image file
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error("Error creating burned image:", error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
};
