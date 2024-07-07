const fs = require('fs');
const pathFile = __dirname + '/autoreact/autoreact.txt';

const emojiList = [
    '😄', '😆', '😂', '🤣', '😊', '😍', '🥰', '😘', '😜', '😎',
    '🤓', '😇', '🥳', '🤩', '🥺', '😋', '😛', '🤪', '😉', '🤗',
    '🤠', '🤡', '🥴', '😵', '🤯', '🤥', '🤫', '🤭', '🧐', '🤨',
    '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤐', '🤔', '🤫',
    '🤭', '🤥', '🤡', '🥶', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '👽', '👾', '💀', '☠️', '👻', '🤖', '🎃', '😈', '👹', '👺',
    '👿', '💩', '👻', '👽', '🤠', '🤡', '👺', '💀', '👻', '👽',
    '👾', '☠️', '🤖', '🎃', '😈', '👹', '👿', '💩', '👻', '👽',
    '🤠', '🤡', '👺', '💀', '👻', '👽', '👾', '☠️', '🤖', '🎃'
];

let autoReactEnabled = true;

module.exports.config = {
    name: "autoreact",
    version: "1.0.0",
    credits: "nayan",
    description: "Enables or disables auto reactions to messages.",
    commandCategory: "auto",
    usages: ["!autoreact awto on/off - Enable or disable autoreactions."],
    cooldowns: 5,
    dependencies: {
        "fs": "",
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID } = event;

    if (!args[0] || (args[0] !== "awto" && args[0] !== "off")) {
        return api.sendMessage("Incorrect syntax. Use `awto on` or `awto off`.", threadID);
    }

    if (args[0] === "awto") {
        autoReactEnabled = true;
        await saveStateToFile(true);
        return api.sendMessage("Auto reactions enabled.", threadID);
    } else if (args[0] === "off") {
        autoReactEnabled = false;
        await saveStateToFile(false);
        return api.sendMessage("Auto reactions disabled.", threadID);
    }
};

async function saveStateToFile(state) {
    try {
        await fs.writeFile(pathFile, String(state));
    } catch (error) {
        console.error('Error saving autoReact state:', error);
    }
}

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, senderID, messageID } = event;

    if (autoReactEnabled && event.type === "message") {
        const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        api.setMessageReaction(randomEmoji, messageID);
    }
};
