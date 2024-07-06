const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
    name: "help",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "Priyansh Rajput",
    description: "Beginner's Guide",
    commandCategory: "system",
    usages: "[Tên module]",
    cooldowns: 1,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 300
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": "「 %1 」\n%2\n\n❯ Usage: %3\n❯ Category: %4\n❯ Waiting time: %5 seconds(s)\n❯ Permission: %6\n\n» Module code by %7 «",
        "helpList": '[ There are %1 commands on this bot, Use: "%2help nameCommand" to know how to use! ]',
        "user": "User",
        "adminGroup": "Admin group",
        "adminBot": "Admin bot",
        "randomFact": "Random Fact: %1",
        "dateTime": "Date and Time: %1\nDay: %2"
    }
};

const minecraftFacts = [
    "Minecraft was created by Markus Persson, also known as 'Notch'.",
    "Creepers were a coding error, intended to be pigs.",
    "Minecraft's world is approximately eight times the size of Earth.",
    "Minecraft was inspired by games like Dwarf Fortress, RollerCoaster Tycoon, and Dungeon Keeper.",
    "The Ender Dragon is the first official boss in Minecraft.",
    "You can play Minecraft in 'Peaceful' mode to avoid hostile mobs.",
    "Minecraft's first version was created in just six days.",
    "The rarest item in Minecraft is the Dragon Egg.",
    "Steve and Alex are the default character skins in Minecraft.",
    "Minecraft is used in education to teach subjects like math and history."
];

const codFacts = [
    "The first Call of Duty game was released in 2003.",
    "Call of Duty has been set in various historical and fictional settings.",
    "The franchise has sold over 300 million copies worldwide.",
    "Call of Duty: Modern Warfare 3 grossed $1 billion in 16 days.",
    "Call of Duty: Black Ops is the best-selling game in the franchise.",
    "The series has won numerous awards, including Game of the Year.",
    "Call of Duty features both single-player and multiplayer modes.",
    "The games often include realistic and historical weapons.",
    "Call of Duty: Warzone is a popular free-to-play battle royale game.",
    "The franchise has a loyal fan base and competitive esports scene."
];

function getRandomFact() {
    const facts = [...minecraftFacts, ...codFacts];
    return facts[Math.floor(Math.random() * facts.length)];
}

function getCurrentDateTime() {
    return moment().tz("Asia/Manila").format("MMMM Do YYYY, h:mm:ss a");
}

function getCurrentDay() {
    return moment().tz("Asia/Manila").format("dddd");
}

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
    if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    const randomFact = getRandomFact();
    const dateTime = getCurrentDateTime();
    const day = getCurrentDay();

    return api.sendMessage(
        getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits) + 
        `\n\n${getText("randomFact", randomFact)}\n\n${getText("dateTime", dateTime, day)}`, 
        threadID, 
        messageID
    );
}

module.exports.run = function({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    const randomFact = getRandomFact();
    const dateTime = getCurrentDateTime();
    const day = getCurrentDay();

    if (!command) {
        const arrayInfo = [];
        const page = parseInt(args[0]) || 1;
        const numberOfOnePage = 10;
        let i = 0;
        let msg = "";

        for (var [name, value] of (commands)) {
            name += ``;
            arrayInfo.push(name);
        }

        arrayInfo.sort((a, b) => a.data - b.data);

        const startSlice = numberOfOnePage * page - numberOfOnePage;
        i = startSlice;
        const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

        for (let item of returnArray) msg += `├─🆓 | ${prefix}${item}\n│\n├─────────────⟡\n`;

        const siu = `📍| 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n\n${msg}├─⚙ Total Pages: ${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)}\n│ 👑 Made with by hung sai shing\n│ 👑Bot admin by hung sai shing\n╰───────────────⟡`;

        return api.sendMessage(siu + `\n\n${getText("randomFact", randomFact)}\n\n${getText("dateTime", dateTime, day)}`, threadID, async (error, info) => {
            if (autoUnsend) {
                await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
                return api.unsendMessage(info.messageID);
            } else return;
        }, messageID);
    }

    return api.sendMessage(
        getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits) + 
        `\n\n${getText("randomFact", randomFact)}\n\n${getText("dateTime", dateTime, day)}`, 
        threadID, 
        messageID
    );
};
