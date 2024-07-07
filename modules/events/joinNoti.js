const { createCanvas, loadImage } = require('canvas');
const { join } = require('path');
const fs = require('fs-extra');
const moment = require('moment-timezone');

module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
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
    if (!existsSync(path)) mkdirSync(path, { recursive: true });

    const path2 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });
};

module.exports.run = async function({ api, event, Users, Threads }) {
    const { threadID } = event;

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        let { threadName } = await api.getThreadInfo(threadID);
        const time = moment.tz("Asia/Manila").format("DD/MM/YYYY || HH:mm:ss");
        const day = moment.tz("Asia/Manila").format("dddd");

        return api.sendMessage(
            `\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n${global.config.BOTNAME} has connected successfully\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n` +
            `Thread Name: ${threadName}\n` +
            `Date: ${time}\n` +
            `Day: ${day}\n` +
            `HOW TO USE?? TYPE\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n${global.config.PREFIX}help to see all commands\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n` +
            `INFO ABOUT OWNER\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\nNAME IS ${global.config.OWNER}\n` +
            `FB IS ${global.config.FACEBOOK}\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\nENJOY\n●▬▬▬▬▬๑⇩⇩๑▬▬▬▬▬●\n`, threadID
        );
    } else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            const time = moment.tz("Asia/Manila").format("DD/MM/YYYY || HH:mm:ss");
            const day = moment.tz("Asia/Manila").format("dddd");
            const hours = moment.tz("Asia/Manila").format("HH");

            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};

            const path = join(__dirname, "cache", "joinGif");
            const pathWelcomeImage = join(path, "welcome.png");

            const nameArray = [];
            const mentions = [];

            for (let i of event.logMessageData.addedParticipants) {
                const userName = i.fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id: i.userFbId });
            }

            const memberCount = participantIDs.length;
            const session = hours <= 10 ? "Morning" :
                hours > 10 && hours <= 12 ? "Afternoon" :
                hours > 12 && hours <= 18 ? "Evening" : "Night";

            const msgTemplate = threadData.customJoin || 
                "Hello {name}\n\nWelcome to {threadName}\n\nYou are the {soThanhVien}th member\n\nTime joined: {time}\n\nDay: {day}\n\nHave a nice {session}!";
            const msg = msgTemplate
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{soThanhVien}/g, memberCount)
                .replace(/\{threadName}/g, threadName)
                .replace(/\{time}/g, time)
                .replace(/\{day}/g, day)
                .replace(/\{session}/g, session);

            if (!existsSync(pathWelcomeImage)) {
                const welcomeImageURL = 'https://i.postimg.cc/T1pCgP8F/welcome.png';
                const response = await fetch(welcomeImageURL);
                const buffer = await response.buffer();
                await fs.writeFile(pathWelcomeImage, buffer);
            }

            const createWelcomeImage = async (userID, userName) => {
                const welcomeImage = await loadImage(pathWelcomeImage);
                const userImage = await loadImage(`https://graph.facebook.com/${userID}/picture?type=large`);

                const canvas = createCanvas(welcomeImage.width, welcomeImage.height);
                const ctx = canvas.getContext('2d');

                ctx.drawImage(welcomeImage, 0, 0, canvas.width, canvas.height);

                const imageSize = 150; // Adjust size as needed
                const x = 100; // Adjust position as needed
                const y = 150; // Adjust position as needed
                ctx.drawImage(userImage, x, y, imageSize, imageSize);

                ctx.font = '30px Arial';
                ctx.fillStyle = '#000';
                ctx.fillText(threadName, 300, 100);
                ctx.fillText(`Member: ${memberCount}`, 300, 150);

                const filePath = join(__dirname, 'cache', 'joinGif', 'welcome_image.png');
                const out = fs.createWriteStream(filePath);
                const stream = canvas.createPNGStream();
                stream.pipe(out);

                return new Promise((resolve, reject) => {
                    out.on('finish', () => resolve(filePath));
                    out.on('error', (err) => reject(err));
                });
            };

            const filePath = await createWelcomeImage(mentions[0].id, mentions[0].tag);

            const formPush = {
                body: msg,
                attachment: fs.createReadStream(filePath),
                mentions
            };

            api.sendMessage(formPush, threadID);

            fs.unlinkSync(filePath);

        } catch (e) {
            console.log(e);
        }
    }
};
