const axios = require("axios");

module.exports.config = {
    name: "help",
    version: "1.0.2",
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
        "randomFact": "Random Fact: %1"
    }
};

const minecraftFacts = [
    "Minecraft was created by Markus Persson, also known as 'Notch'.",
    "Creepers were a coding error, intended to be pigs.",
    "Minecraft's world is approximately eight times the size of Earth.",
    "Minecraft was inspired by games like Dwarf Fortress, RollerCoaster Tycoon, and Dungeon Keeper."
];

const codFacts = [
    "The first Call of Duty game was released in 2003.",
    "Call of Duty has been set in various historical and fictional settings.",
    "The franchise has sold over 300 million copies worldwide.",
    "Call of Duty: Modern Warfare 3 grossed $1 billion in 16 days."
];

function getRandomFact() {
    const facts = [...minecraftFacts, ...codFacts];
    return facts[Math.floor(Math.random() * facts.length)];
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

    return api.sendMessage(
        getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits) + 
        `\n\n${getText("randomFact", randomFact)}`, 
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

        for (let item of returnArray) msg += `「 ${++i} 」${prefix}${item}\n`;

        const siu = `Here is the command list. For more info type $help (command name).\n\n${getText("randomFact", randomFact)}`;
        const text = `\nPage (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})\n`;

        return api.sendMessage(siu + "\n\n" + msg + text, threadID, async (error, info) => {
            if (autoUnsend) {
                await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
                return api.unsendMessage(info.messageID);
            } else return;
        }, messageID);
    }

    return api.sendMessage(
        getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits) + 
        `\n\n${getText("randomFact", randomFact)}`, 
        threadID, 
        messageID
    );
};
