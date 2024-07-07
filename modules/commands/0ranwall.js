const fs = require('fs');
const { join } = require('path');
const moment = require('moment-timezone');

module.exports.config = {
    name: "rantwall",
    version: "1.0.0",
    credits: "YourName",
    description: "Allow users to confess anonymously or tag themselves with messages displayed on a rant wall.",
    commandCategory: "social", // Adjust the category as needed
    usages: ["!rantwall [confession] [name/anonymous] [confessor name] [timezone] [datetime] [days] - Post a confession."],
    cooldowns: 10, // Adjust cooldown as per your preference
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const [confession, confessorType, confessorNameOrAnonymous, timezoneName, datetime, days] = args;

    if (!confession || !confessorType || !confessorNameOrAnonymous || !timezoneName || !datetime || !days) {
        api.sendMessage("Please provide all required parameters: confession, name/anonymous, confessor name, timezone, datetime, days.", threadID, messageID);
        return;
    }

    try {
        // Determine if the confessor should be anonymous or tagged
        let confessorText = "";
        if (confessorType.toLowerCase() === "anonymous") {
            confessorText = "Anonymous";
        } else {
            confessorText = `Confessor: ${confessorNameOrAnonymous}`;
        }

        // Format date and time in the specified timezone
        const postDateTime = moment.tz(datetime, timezoneName).format('YYYY-MM-DD HH:mm:ss');

        // Construct the message to be posted
        const messageToPost = `Confession: ${confession}\n${confessorText}\nPost Date: ${postDateTime}\nDays: ${days}`;

        // Simulate posting to a rant wall (replace with your actual posting logic)
        console.log("Posting confession:", messageToPost);

        // Example: Save the confession to a file (adjust as per your storage needs)
        const filePath = join(__dirname, 'confessions.txt');
        fs.appendFileSync(filePath, `${messageToPost}\n`);

        // Send confirmation message
        api.sendMessage("Your confession has been posted on the rant wall.", threadID, messageID);
    } catch (error) {
        console.error("Error posting confession:", error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID, messageID);
    }
};
