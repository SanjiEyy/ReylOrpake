const os = require('os');
const moment = require('moment');

module.exports.config = {
  name: 'uptime2',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'ChatGPT',
  description: 'Displays how long the bot has been running.',
  commandCategory: 'system',
  usages: 'uptime2',
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  try {
    // Get the system uptime in seconds
    const uptime = os.uptime();
    
    // Calculate days, hours, minutes, and seconds
    const uptimeDuration = moment.duration(uptime, 'seconds');
    const days = Math.floor(uptimeDuration.asDays());
    const hours = uptimeDuration.hours();
    const minutes = uptimeDuration.minutes();
    const seconds = uptimeDuration.seconds();

    // Construct the message to send
    const message = `Bot has been running for: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`;

    // Send the constructed message
    api.sendMessage(message, threadID, messageID);
  } catch (error) {
    console.error('Error calculating uptime:', error);
    api.sendMessage('An error occurred while calculating the bot uptime. Please try again later.', threadID, messageID);
  }
};
