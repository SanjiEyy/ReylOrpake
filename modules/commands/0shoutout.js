const { join } = require('path');
const fs = require('fs');

module.exports.config = {
    name: "shoutout",
    version: "1.0.0",
    credits: "YourName",
    description: "Give a shoutout to someone with a personalized message.",
    commandCategory: "social", // Adjust the category as needed
    usages: ["!shoutout [person] [message] - Give a shoutout to someone."],
    cooldowns: 10, // Adjust cooldown as per your preference
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const [person, ...messageArgs] = args;
    const message = messageArgs.join(' ');

    if (!person || !message) {
        api.sendMessage("Please provide both the person and the message for the shoutout.", threadID, messageID);
        return;
    }

    try {
        const shoutoutMessage = `📣 Shoutout to ${person}!\n${message}`;

        // Example: Save the shoutout to a file (adjust as per your storage needs)
        const filePath = join(__dirname, 'shoutouts.txt');
        fs.appendFileSync(filePath, `${shoutoutMessage}\n`);

        // Send the shoutout message
        api.sendMessage(shoutoutMessage, threadID, messageID);
    } catch (error) {
        console.error("Error giving shoutout:", error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
};
