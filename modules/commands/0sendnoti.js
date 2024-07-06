const axios = require('axios');
const moment = require('moment-timezone');
const fs = require('fs');
const { exec } = require('child_process');

module.exports.config = {
  name: 'sendnoti',
  version: '1.0.0',
  hasPermssion: 2, // Only admins can use this command
  credits: 'ChatGPT',
  description: 'Sends a notification from admin to all chat groups with timestamp and robotic voice.',
  commandCategory: 'admin',
  usages: 'sendnoti [message]',
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Users, Threads }) {
  const { senderID, messageID } = event;

  // Check if the user has provided a message
  if (args.length === 0) {
    return api.sendMessage('Please provide a message. Usage: sendnoti [message]', event.threadID, messageID);
  }

  const messageContent = args.join(' '); // Join all arguments to form the message
  const dateTime = moment.tz('Asia/Manila').format('MMMM Do YYYY, h:mm:ss a');
  const message = `Notification from admin:\n${messageContent}\n\nDo not reply to this message.\n\nDate and Time: ${dateTime}`;

  try {
    // Generate robotic voice
    const voiceFilePath = '/tmp/robotic_voice.mp3';
    exec(`gtts-cli '${messageContent}' --output ${voiceFilePath}`, async (err) => {
      if (err) {
        console.error('Error generating robotic voice:', err);
        return api.sendMessage('Error generating robotic voice. Please try again later.', event.threadID, messageID);
      }

      // Get all thread IDs
      const allThreads = await Threads.getAll();
      const threadIDs = allThreads.map(thread => thread.threadID);

      // Send message and voice to all threads
      for (const id of threadIDs) {
        api.sendMessage({ 
          body: message, 
          attachment: fs.createReadStream(voiceFilePath)
        }, id);
      }

      // Cleanup temporary voice file
      fs.unlinkSync(voiceFilePath);
    });

    api.sendMessage('Notification sent to all groups.', event.threadID, messageID);
  } catch (error) {
    console.error('Error sending notifications:', error);
    api.sendMessage('An error occurred while sending notifications. Please try again later.', event.threadID, messageID);
  }
};
