const emojiList = [
    '😄', '😆', '😂', '🤣', '😊', '😍', '🥰', '😘', '😜', '😎',
    '🤓', '😇', '🥳', '🤩', '🥺', '😋', '😛', '🤪', '😉', '🤗',
    '🤠', '🤡', '🥴', '😵', '🤯', '🤥', '🤫', '🤭', '🧐', '🤨',
    '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤐', '🤔', '🤫',
    '🤭', '🤥', '🤡', '🥶', '😷', '🤒', '🤕', '🤢', '🤮', '🤧'
];

let reacting = false;

module.exports.config = {
    name: "autoreact",
    version: "1.0.0",
    credits: "YourName",
    description: "React with random emoji to sender's messages.",
    commandCategory: "admin", // Adjust the category as needed
    adminOnly: true, // Only admins can use this command
    usages: ["!autoreact awto on/off - Enable or disable autoreactions."],
};

module.exports.run = function({ api, event, args }) {
    const { threadID, senderID, messageID } = event;

    if (!args[0] || (args[0] !== "awto" && args[0] !== "off")) {
        api.sendMessage("Invalid usage. Please use `awto on` or `awto off`.", threadID);
        return;
    }

    if (args[0] === "awto") {
        reacting = true;
        api.sendMessage("Autoreactions enabled.", threadID);
    } else if (args[0] === "off") {
        reacting = false;
        api.sendMessage("Autoreactions disabled.", threadID);
    }

    api.listen((err, event) => {
        if (err) {
            console.error(err);
            return;
        }

        if (reacting && event.senderID !== senderID && event.type === "message") {
            const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
            api.setMessageReaction(randomEmoji, messageID);
        }
    });
};
