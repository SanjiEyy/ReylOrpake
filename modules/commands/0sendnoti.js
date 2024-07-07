const moment = require('moment-timezone');

module.exports.config = {
    name: "sendnoti",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Send a notification message to all threads.",
    commandCategory: "admin",
    usages: ["sendnoti [message]"],
    cooldowns: 5,
    isAdminCommand: true,
};

module.exports.run = function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const message = args.join(' ');

    if (!message) {
        return api.sendMessage("Please provide a message to send.", threadID, messageID);
    }

    // Get current time in Asia/Manila timezone
    const gio = moment.tz("Asia/Manila").format("HH:mm:ss || D/MM/YYYY");
    const days = moment().tz("Asia/Manila").format('dddd');

    // Get thread list and send message to each thread
    api.getThreadList(100, null, ['INBOX'], (err, list) => {
        if (err) {
            console.error("Error fetching thread list:", err);
            return api.sendMessage("An error occurred while fetching thread list.", threadID, messageID);
        }

        list.forEach(thread => {
            const threadName = thread.name || 'Unnamed Thread';
            const threadID = thread.threadID;

            // Construct the message with timezone information and thread name
            const msg = {
                body: `✾══━━───✷꥟✷───━━══✾\nNotification from Admin:\n✾══━━───✷꥟✷───━━══✾\n\n➤ Time: ${gio}\n➤ Day: ${days}\n➤ Thread Name: ${threadName}\n\nMessage Content:\n${message}\n\n✾══━━───✷꥟✷───━━══✾`,
            };

            // Send message to each thread
            api.sendMessage(msg, threadID, (err, info) => {
                if (err) {
                    console.error(`Error sending message to thread ${threadID}:`, err);
                }
            });
        });

        // Notify admin about successful delivery
        api.sendMessage(`Notification sent successfully to ${list.length} threads.`, threadID, messageID);
    });
};
