const axios = require("axios");
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.4",
    credits: "MrTomXxX",
    description: "Notify bot or group member with random gif/photo/video",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinGif");
    if (existsSync(path)) mkdirSync(path, { recursive: true });

    const path2 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
};

module.exports.run = async function ({ api, event, Users, Threads }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`» ${global.config.PREFIX} « → ${(!global.config.BOTNAME) ? "👾hungshyshing👾" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        const time = moment.tz("Asia/Manila").format("DD/MM/YYYY || HH:mm:ss");
        const dayOfWeek = moment.tz("Asia/Manila").format("dddd");
        const threadName = event.logMessageData.threadName || "Unknown Thread";
        return api.sendMessage(`\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n${global.config.BOTNAME} has connected successfully\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\nHOW TO USE?? TYPE\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n${global.config.PREFIX}help to see all commands\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\nINFO ABOUT OWNER\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\nNAME IS ${global.config.OWNER}\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\nFB IS ${global.config.FACEBOOK}\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\nENJOY\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n\nBot joined at:\nTime: ${time}\nDay: ${dayOfWeek}\nThread Name: ${threadName}`, threadID);
    } else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            const moment = require("moment-timezone");

            const time = moment.tz("Asia/Manila").format("DD/MM/YYYY || HH:mm:ss");
            const dayOfWeek = moment.tz("Asia/Manila").format("dddd");
            const hours = moment.tz("Asia/Manila").format("HH");

            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const path = join(__dirname, "cache", "joimp4");

            const name = event.logMessageData.addedParticipants[0].fullName;
            const groupName = encodeURIComponent(threadName);
            const groupIcon = encodeURIComponent("https://i.ibb.co/G5mJZxs/rin.jpg");
            const memberCount = participantIDs.length;
            const uid = 4;
            const background = encodeURIComponent("https://i.ibb.co/4YBNyvP/images-76.jpg");

            const welcomeURL = `https://joshweb.click/canvas/welcome?name=${name}&groupname=${groupName}&groupicon=${groupIcon}&member=${memberCount}&uid=${uid}&background=${background}`;

            // Load the image from the URL
            const imageBuffer = await loadImage(welcomeURL);
            const canvas = createCanvas(imageBuffer.width, imageBuffer.height);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(imageBuffer, 0, 0, imageBuffer.width, imageBuffer.height);

            // Add date, time, and day information to the image
            ctx.font = "24px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(time, canvas.width / 2, canvas.height - 60);
            ctx.fillText(dayOfWeek, canvas.width / 2, canvas.height - 30);

            const buffer = canvas.toBuffer();
            const pathGif = join(path, `welcome.gif`);
            await fs.outputFile(pathGif, buffer);

            let msg = `Hello ${name},\n\nWelcome to ${threadName}! You are the ${memberCount}th member.\n\nTime joined: ${time}\n\nHave a nice ${hours <= 10 ? "Morning" : hours > 10 && hours <= 12 ? "Afternoon" : hours > 12 && hours <= 18 ? "Evening" : "Night"}!`;

            if (existsSync(path)) mkdirSync(path, { recursive: true });

            // Use the specified GIF if available, otherwise fallback to a random GIF
            const greetingGif = "https://imgur.com/B09J83u";
            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));

            let formPush;
            if (existsSync(pathGif)) {
                formPush = { body: msg, attachment: createReadStream(pathGif), mentions: [{ tag: name, id: event.logMessageData.addedParticipants[0].userFbId }] };
            } else if (randomPath.length !== 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions: [{ tag: name, id: event.logMessageData.addedParticipants[0].userFbId }] };
            } else {
                formPush = { body: msg, mentions: [{ tag: name, id: event.logMessageData.addedParticipants[0].userFbId }] };
            }

            // Send the message with the GIF
            await api.sendMessage(formPush, threadID);

        } catch (e) {
            console.log(e);
        }
    }
};
