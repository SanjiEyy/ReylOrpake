const ytdl = require('ytdl-core');
const ytb = require('ytb-core');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'music',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'ChatGPT',
  description: 'Searches for songs on YouTube and allows the user to choose one to play.',
  commandCategory: 'music',
  usages: 'music [song name]',
  cooldowns: 5,
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;

  // Check if the reply is a number between 1 and 5
  const choice = parseInt(body);
  if (isNaN(choice) || choice < 1 || choice > 5) {
    return api.sendMessage('Please choose a number between 1 and 5.', threadID, messageID);
  }

  const selectedVideo = handleReply.videos[choice - 1];

  // Delete the initial message to avoid clutter
  api.unsendMessage(handleReply.messageID);

  try {
    // Download the chosen video as an audio file
    const audioStream = ytdl(selectedVideo.url, { filter: 'audioonly' });
    const audioPath = path.join(__dirname, 'temp', `${senderID}.mp3`);
    const writeStream = fs.createWriteStream(audioPath);

    audioStream.pipe(writeStream);

    writeStream.on('finish', () => {
      api.sendMessage({
        body: `Here is your song: ${selectedVideo.title}`,
        attachment: fs.createReadStream(audioPath)
      }, threadID, () => {
        // Clean up the temporary audio file
        fs.unlinkSync(audioPath);
      });
    });
  } catch (error) {
    console.error('Error downloading audio:', error);
    api.sendMessage('An error occurred while processing your request. Please try again later.', threadID, messageID);
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  // Check if the user has provided a song name
  if (args.length === 0) {
    return api.sendMessage('Please provide a song name. Usage: music [song name]', threadID, messageID);
  }

  const songName = args.join(' ');

  try {
    // Search for the song on YouTube
    const results = await ytb.search(songName, { limit: 5 });

    if (!results || results.length === 0) {
      return api.sendMessage('No songs found. Please try again with a different name.', threadID, messageID);
    }

    // Construct the message with the search results
    let message = 'Here are the top 5 results:\n';
    results.forEach((video, index) => {
      message += `${index + 1}. ${video.title} (${video.duration})\n`;
    });
    message += 'Reply with the number of the song you want to choose.';

    // Send the search results message and wait for a reply
    api.sendMessage(message, threadID, (err, info) => {
      if (err) return console.error(err);

      // Set up a handleReply to capture the user's choice
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        senderID: event.senderID,
        threadID: event.threadID,
        videos: results
      });
    });
  } catch (error) {
    console.error('Error searching for songs:', error);
    api.sendMessage('An error occurred while searching for songs. Please try again later.', threadID, messageID);
  }
};
