module.exports.config = {
  name: "lyrics",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "LTChi",
  description: "View lyrics",
  commandCategory: "media",
  usages: "[name of the song]",
  cooldowns: 5
};
module.exports.run = async function ({ api, args, event }) {
  const axios = require('axios');
  let lyrics = await axios.get(`https://joshweb.click/search/lyrics?q=${args.join(" ")}`)
    .then(res => {
      // console.log(res.data)
      if (res.data.lyrics) {
        // return res.data.lyrics;
        return res.data.lyrics;
      } else {
        return "Not Found!";
      }
    })
    .catch(err => {
      return "Not Found!";
    });
  api.sendMessage(`${lyrics}`, event.threadID, event.messageID);
  api.setMessageReaction("🎼", event.messageID, (err) => {}, true)
}