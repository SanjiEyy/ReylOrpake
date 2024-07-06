module.exports.config = {  
  name: "shotiv",  
  version: "1.0.0",  
  credits: "libyzxy0",  
  description: "Generate random TikTok girl videos",  
  hasPermssion: 0,  
  commandCategory: "other",  
  usage: "[shoti]",  
  cooldowns: 5,  
  dependencies: [],  
};  

module.exports.run = async ({ api, event }) => {  
  const axios = require("axios");  
  const request = require("request");  
  const fs = require("fs");  

  try {  
    const response = await axios.get("https://www.jjohndev.xyz/tool/tiktok-downloader/");  
    const videoUrl = response.data.data.url;  
    const filePath = `${__dirname}/cache/shoti.mp4`;  

    console.log(`Downloading video ${videoUrl}...`);  

    const file = fs.createWriteStream(filePath);  
    const req = request(encodeURI(videoUrl));  

    req.pipe(file);  

    file.on("finish", () => {  
      console.log("Video downloaded successfully!");  
      api.sendMessage({  
        body: "",  
        attachment: fs.createReadStream(filePath),  
      }, event.threadID, event.messageID);  
    });  
  } catch (error) {  
    console.error("Error downloading video:", error);  
  }  
};  
