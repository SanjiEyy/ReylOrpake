module.exports.config = {
    name: "rizzen",
    version: "1.0.0",
    credits: "YourName",
    description: "Tags someone and sends a funny or romantic 'rizz' message.",
    commandCategory: "fun",
    usages: ["!rizzen @mention - Sends a funny or romantic 'rizz' message to the mentioned person."],
    cooldowns: 5,
    allowNoPrefix: true
};

const funnyRizzMessages = [
    "{mention}, if you were a vegetable, you'd be a 'cute-cumber'! 🥒😄",
    "Hey {mention}, are you a magician? Whenever I look at you, everyone else disappears! ✨😊",
    "{mention}, if kisses were snowflakes, I'd send you a blizzard! ❄️💋",
    "Do you have a name, or can I call you mine? 😉❤️",
    "{mention}, if laughter is the best medicine, then you must be a pharmacy! 😆💊",
    "Hey {mention}, do you have a map? I keep getting lost in your eyes! 🗺️😍",
    "{mention}, you're so sweet, you could put Hershey's out of business! 🍫😄",
    "If you were a song, you'd be the best melody ever composed! 🎵❤️",
    "{mention}, are you a time traveler? Because every time I see you, I'm transported to paradise! ⏳🏝️",
    "Hey {mention}, if I could rearrange the alphabet, I'd put U and I together! 💌😊",
    "Do you have a Band-Aid? Because I just scraped my knee falling for you! 💘😄"
];

const romanticRizzMessages = [
    "{mention}, you're the sunshine on my cloudy days. ☀️❤️",
    "Hey {mention}, you make my heart skip a beat every time I see you. 💓😊",
    "{mention}, loving you is as natural as breathing. 🌿💕",
    "If there's one thing I'm sure of, it's that my love for you grows stronger every day. 💖😘",
    "{mention}, you're not just my partner, you're my best friend and my everything. 🌟❤️",
    "Every moment with you feels like a fairy tale come true. ✨👑",
    "{mention}, you're the missing piece that completes my puzzle of life. 🧩💞",
    "Hey {mention}, I fall in love with you more and more each day. 🌹😊",
    "{mention}, being with you feels like a dream I never want to wake up from. 💭💖",
    "Your love is my favorite adventure. Let's keep exploring together. 🌍❤️",
    "In a world full of chaos, you're my peace. Thank you for being my sanctuary. 🕊️💕"
];

module.exports.run = function({ api, event, args }) {
    const { threadID, senderID, mentions } = event;
    const mention = Object.keys(mentions)[0]; // Get the first mentioned user's ID

    if (!mention) {
        return api.sendMessage("Please tag someone to rizz!", threadID);
    }

    let randomMessage;
    if (Math.random() < 0.5) {
        randomMessage = funnyRizzMessages[Math.floor(Math.random() * funnyRizzMessages.length)];
    } else {
        randomMessage = romanticRizzMessages[Math.floor(Math.random() * romanticRizzMessages.length)];
    }

    const message = randomMessage.replace("{mention}", `[${mention.split("_")[0]}]`);

    api.sendMessage(message, threadID);
};
