const fs = require('fs');
const moment = require('moment-timezone');

module.exports.config = {
    name: "rantwall",
    version: "1.0.0",
    credits: "YourName",
    description: "Post a confession anonymously with a custom name.",
    commandCategory: "fun",
    usages: ["!rantwall [name/anonymous] [confessname] [message] - Post a confession anonymously with a custom name."],
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    // Ensure a name, confessname, and confession are provided
    if (args.length < 3) {
        api.sendMessage("Please provide 'name' or 'anonymous', a confess name, and a confession message to post.", threadID, messageID);
        return;
    }

    // Extract name/anonymous, confessname, and confession from args
    const nameOrAnonymous = args[0].toLowerCase();
    const confessname = args[1];
    const confession = args.slice(2).join(" ");
    
    // Determine the sender's name or anonymous
    const senderName = nameOrAnonymous === "anonymous" ? "Anonymous" : nameOrAnonymous;
    
    try {
        // Create a timestamp with date, time, and day
        const timestamp = moment.tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss (dddd)');

        // Construct the confession message
        const confessionMessage = `${senderName}: ${confession} for anonymous or ${confessname}. Time posted: ${timestamp}`;

        // Example: Save the confession to a file (adjust as per your storage needs)
        const filePath = 'confessions.txt';
        fs.appendFileSync(filePath, `${confessionMessage}\n\n`);

        // Post the confession to the thread
        api.sendMessage(confessionMessage, threadID);

        // Confirm to the sender that their confession was posted
        api.sendMessage("Your confession has been posted.", threadID, messageID);
    } catch (error) {
        console.error("Error posting confession:", error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
};
