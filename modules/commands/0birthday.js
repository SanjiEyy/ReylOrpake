const { Sticker } = require('facebook-chat-api');

module.exports.config = {
    name: "birthday",
    version: "1.0.0",
    credits: "YourName",
    description: "Respond with a random birthday greeting and stickers when someone says 'happy birthday'.",
    commandCategory: "social", // Adjust the category as needed
};

// Array of birthday greetings and corresponding sticker numbers
const birthdayGreetings = [
    { message: "🎉 Happy Birthday! 🎂", sticker: "100" },
    { message: "🥳 Wishing you a fantastic birthday! 🎈", sticker: "101" },
    { message: "🎁 May your birthday be filled with joy and laughter! 🎊", sticker: "102" },
    // Add more greetings and stickers as needed
];

module.exports.run = async function({ api, event }) {
    const { body } = event;
    const threadID = event.threadID;

    // Check if the message contains "happy birthday"
    if (body.toLowerCase().includes("happy birthday")) {
        try {
            // Select a random greeting from the array
            const randomIndex = Math.floor(Math.random() * birthdayGreetings.length);
            const { message, sticker } = birthdayGreetings[randomIndex];

            // Send the greeting message
            api.sendMessage({
                body: message,
                sticker: new Sticker(sticker, "mid"),
            }, threadID);
        } catch (error) {
            console.error("Error responding to birthday:", error);
        }
    }
};
