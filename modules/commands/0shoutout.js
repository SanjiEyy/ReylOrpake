const { join } = require('path');
const fs = require('fs-extra');

module.exports.config = {
    name: "shoutout",
    version: "1.0.1",
    credits: "YourName",
    description: "Give a shoutout to someone with a personalized message.",
    commandCategory: "social", // Adjust the category as needed
    usages: ["!shoutout [person] [message] - Give a shoutout to someone."],
    cooldowns: 10, // Adjust cooldown as per your preference
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const [shoutName, ...messageArgs] = args;
    const message = messageArgs.join(' ');

    if (!shoutName || !message) {
        api.sendMessage("Please provide both the person and the message for the shoutout.", threadID, messageID);
        return;
    }

    try {
        const userName = await Users.getNameUser(senderID);
        const shoutoutMessage = `📣 Shoutout to ${shoutName}!\n\nMessage: ${message}\n\nFrom: ${userName}`;

        // Example: Save the shoutout to a file (adjust as per your storage needs)
        const filePath = join(__dirname, 'shoutouts.txt');
        fs.appendFileSync(filePath, `${shoutoutMessage}\n`);

        // Retrieve all thread IDs the bot is part of
        const threads = await api.getThreadList(100, null, ['INBOX']);
        const threadIDs = threads.map(thread => thread.threadID);

        // Send the shoutout message to all threads
        for (const id of threadIDs) {
            api.sendMessage(shoutoutMessage, id);
        }

        // Confirmation message in the thread where the command was used
        api.sendMessage("Shoutout sent across all threads!", threadID, messageID);
    } catch (error) {
        console.error("Error giving shoutout:", error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
};
