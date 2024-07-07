const fs = require('fs');
const moment = require('moment-timezone');
const axios = require('axios');

module.exports.config = {
    name: "sendnoti2",
    version: "1.0.0",
    credits: "YourName",
    description: "Send a notification across all threads with Google Voice in Tagalog.",
    commandCategory: "admin", // Adjust the category as needed
    adminOnly: true, // Only admins can use this command
    usages: ["!sendnoti2 [message] [timezone] [datetime] [days] - Send a notification across all threads."],
};

// Array of random meme texts
const memeTexts = [
    "LOL, this is epic!",
    "When you see it... 😂",
    "That feeling when...",
    "Me trying to handle life...",
    "Just another day in paradise.",
    "I can't believe this happened!",
    "Hugot ng mga umibig...",
    "Kain tayo!",
    "Who did this?! 😆",
    "Anong petsa na?",
    "Just keep swimming!",
    "Kapit lang, bes!",
    "Wala pong forever.",
    "Walang iwanan!",
    "Ikaw ang aking bituin.",
    "Tara, inom tayo!",
    "This meme never gets old.",
    "Ito na ang pagkakataon!",
    "Game on!",
    "Stay positive!",
];

module.exports.run = async function({ api, event, args }) {
    const { threadID, senderID } = event;
    const [message, timezoneName, datetime, days] = args;

    if (!message || !timezoneName || !datetime || !days) {
        api.sendMessage("Please provide all required parameters: message, timezone, datetime, days.", threadID);
        return;
    }

    try {
        // Format date and time in the specified timezone
        const notiDateTime = moment.tz(datetime, timezoneName).format('YYYY-MM-DD HH:mm:ss');

        // Construct the notification message
        const notificationMessage = `📣 ${message}\n\n🕒 Petsa at Oras: ${notiDateTime}\n📅 Araw: ${days}\n\n🎉 ${getRandomMemeText()}`;

        // Example: Save the notification to a file (adjust as per your storage needs)
        const filePath = 'notifications.txt';
        fs.appendFileSync(filePath, `${notificationMessage}\n\n`);

        // Get all active threads
        const threads = await api.getThreadList(20); // Adjust the limit as needed

        // Send the notification message to each thread
        threads.forEach(async thread => {
            try {
                // Get the Google TTS URL for Tagalog message
                const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(message)}&tl=tl&client=tw-ob`;

                // Send the notification message with Google Voice
                await api.sendMessage({
                    body: notificationMessage,
                    attachment: axios({
                        url: googleTTSUrl,
                        responseType: 'stream'
                    })
                }, thread.threadID);
            } catch (error) {
                console.error(`Error sending notification to thread ${thread.threadID}:`, error);
            }
        });

        // Confirmation message to the admin
        api.sendMessage("Notification sent to all threads.", threadID);
    } catch (error) {
        console.error("Error sending notification:", error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID);
    }
};

// Function to get a random meme text
function getRandomMemeText() {
    return memeTexts[Math.floor(Math.random() * memeTexts.length)];
}
