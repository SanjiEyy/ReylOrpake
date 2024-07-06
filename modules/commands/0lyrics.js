const axios = require("axios");
const { MessageAttachment } = require("facebook-chat-api");

module.exports.config = {
  name: "lyrics",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "ChatGPT",
  description: "Fetches lyrics for a given song.",
  commandCategory: "media",
  usages: "[song name]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  if (!args[0]) {
    return api.sendMessage("Please provide a song name to search for lyrics.", event.threadID, event.messageID);
  }

  const query = encodeURIComponent(args.join(" "));
  const apiUrl = `https://joshweb.click/search/lyrics?q=${query}`;

  try {
    const response = await axios.get(apiUrl);
    const { data } = response;

    // Check if lyrics are found
    if (!data.lyrics) {
      return api.sendMessage("Lyrics not found for the given song.", event.threadID, event.messageID);
    }

    // Prepare the message with lyrics
    const message = `🎵 Lyrics for "${args.join(" ")}":\n\n${data.lyrics}`;

    // Send the message
    api.sendMessage(message, event.threadID, async (err, messageInfo) => {
      if (err) return console.error(err);

      // Optionally send the lyrics as a file attachment
      const attachment = new MessageAttachment(data.lyrics, "lyrics.txt");
      await api.sendMessage({ attachment }, event.threadID, messageInfo.messageID);
    });
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    api.sendMessage("An error occurred while fetching lyrics. Please try again later.", event.threadID, event.messageID);
  }
};
