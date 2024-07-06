const fs = require('fs');
const axios = require('axios');
const { MessageAttachment } = require('facebook-chat-api');
const moment = require('moment-timezone');
const { join } = require('path');

// Configuration setup
const cacheDir = join(__dirname, 'cache/');
const joinApiUrl = 'https://joshweb.click/canvas/welcome';
const botJoinGifLink = 'https://imgur.com/a/J13ytto'; // Replace with actual GIF link

module.exports.config = {
  name: 'joinnoti',
  eventType: ['log:subscribe', 'log:subscribe_buddy', 'message'],
  version: '1.0.0',
  description: 'Handles join notifications, greetings, and nickname changes.',
  commandCategory: 'system',
  usages: '',
  cooldowns: 5,
  dependencies: {
    fs: '',
    axios: '',
    'moment-timezone': '',
    'facebook-chat-api': '',
  },
};

// Function to fetch profile picture URL from API or use default if not available
async function fetchProfilePic(userId) {
  // Replace with your logic to fetch profile picture URL
  return `https://graph.facebook.com/${userId}/picture?type=large`;
}

// Function to generate and cache the welcome image
async function generateWelcomeImage(name, groupName, groupIcon, memberCount, uid, background) {
  try {
    const response = await axios.get(joinApiUrl, {
      params: {
        name,
        groupname: groupName,
        groupicon: groupIcon,
        member: memberCount,
        uid,
        background,
      },
      responseType: 'arraybuffer',
    });

    // Save the generated image to cache
    const imagePath = join(cacheDir, `joinGif_${uid}.jpg`);
    fs.writeFileSync(imagePath, Buffer.from(response.data), 'binary');
    return imagePath;
  } catch (error) {
    console.error('Error generating welcome image:', error);
    return null;
  }
}

// Function to handle nickname changes and issue warnings
function handleNicknameChange(api, event) {
  const { threadID, senderID, message } = event;
  const botNicknameRegex = new RegExp(`»\\s*${global.config.PREFIX}\\s*«`, 'i');
  const expectedNickname = `»${global.config.BOTNAME}«`;

  if (message && message.match(botNicknameRegex)) {
    const currentNickname = message.match(botNicknameRegex)[0];
    if (currentNickname.toLowerCase() !== expectedNickname.toLowerCase()) {
      // Warn the user
      api.sendMessage(`${global.config.BOTNAME} nickname is managed and cannot be changed. Your attempt has been logged.`, threadID);
      
      // Example: Implement a warning system and ban logic
      // This is a simplified example
      // You should implement a more robust warning system
      let warnings = parseInt(fs.readFileSync(join(__dirname, `warnings/${senderID}.txt`), 'utf-8')) || 0;
      warnings++;
      fs.writeFileSync(join(__dirname, `warnings/${senderID}.txt`), warnings.toString());

      if (warnings >= 3) {
        // Ban logic
        // Example: api.removeUserFromGroup(threadID, senderID);
        api.sendMessage(`${global.config.BOTNAME} nickname violation: You have been banned from using the bot.`, threadID);
      }
    }
  }
}

// Function to handle user join events
async function handleUserJoin(api, event) {
  const { threadID, senderID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const { name: threadName, participantIDs } = threadInfo;
    const memberCount = participantIDs.length;

    // Fetch user's profile picture
    const profilePicUrl = await fetchProfilePic(senderID);

    // Generate welcome image and send message
    const welcomeImage = await generateWelcomeImage(global.config.BOTNAME, threadName, profilePicUrl, memberCount, senderID, 'https://i.ibb.co/4YBNyvP/images-76.jpg');
    if (welcomeImage) {
      api.sendMessage({
        body: `${senderID} has joined the ${threadName}. You are the ${memberCount}th member.\n\nTime and date joined: ${moment().tz('Asia/Manila').format('dddd, MMMM D, YYYY [at] HH:mm:ss')}`,
        attachment: new MessageAttachment(welcomeImage),
      }, threadID);
    }
  } catch (error) {
    console.error('Error handling user join event:', error);
  }
}

// Function to handle bot join event
function handleBotJoin(api, event) {
  const { threadID } = event;

  // Send a specific greeting message with a GIF link
  api.sendMessage({
    body: `${global.config.BOTNAME} has connected to the ${threadID}. Time and date joined: ${moment().tz('Asia/Manila').format('dddd, MMMM D, YYYY [at] HH:mm:ss')}`,
    attachment: new MessageAttachment(botJoinGifLink),
  }, threadID);
}

module.exports.handleEvent = async function({ api, event }) {
  const { type, logMessageType } = event;

  // Handle user join events
  if (type === 'event' && logMessageType === 'log:subscribe') {
    await handleUserJoin(api, event);
  }

  // Handle bot join event
  if (type === 'event' && logMessageType === 'log:subscribe_buddy') {
    handleBotJoin(api, event);
  }

  // Handle nickname changes
  if (type === 'message' && event.isGroup) {
    handleNicknameChange(api, event);
  }
};

module.exports.run = function({ api, event, args }) {
  // This command doesn't require any run logic since it's event-driven
};
