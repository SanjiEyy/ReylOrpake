const fs = require("fs");  
const moment = require("moment-timezone");  

module.exports.config = {  
  name: "prefix",  
  version: "1.0.1",  
  hasPermssion: 0,  
  credits: "John Arida",  
  description: "no prefix",  
  commandCategory: "No command marks needed",  
  usages: "...",  
  cooldowns: 1,  
};  

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {  
  var { threadID, messageID } = event;  
  if (event.body.indexOf("prefix") == 0 || event.body.indexOf("Prefix") == 0 || event.body.indexOf("Ano prefix") == 0 || event.body.indexOf("ano prefix") == 0) {  
    var gio = moment.tz("Asia/Manila").format("HH:mm:ss || D/MM/YYYY");  
    var facts = [  
      "The first easter egg in a video game was in the 1979 game Adventure.",  
      "The original Super Mario Bros. game was released in 1985 for the NES.",  
      "The Legend of Zelda series has sold over 100 million copies worldwide.",  
      "The first game to use a CD-ROM was the 1984 game The Manhole.",  
      "Pac-Man was originally called Puck-Man in Japan.",  
      "The first video game, Computer Space, was released in 1971.",  
      "The highest-grossing video game of all time is Minecraft.",  
      "The first game to use a controller with an analog stick was the 1996 game Super Mario 64.",  
      "The original PlayStation was released in 1994.",  
      "The first game to use 3D graphics was the 1983 game 3D Monster Maze.",  
      "The most popular game of all time is Tetris.",  
      "The first game to use a save system was the 1986 game The Legend of Zelda.",  
      "The first game to use a multiplayer mode was the 1973 game Spacewar!",  
      "The highest-rated game of all time is The Legend of Zelda: Ocarina of Time.",  
      "The first game to use a storyline was the 1986 game Dragon Quest.",  
      "The first game to use a open-world concept was the 1984 game Elite.",  
      "The most popular game franchise of all time is Mario.",  
      "The first game to use a physics engine was the 1999 game Half-Life.",  
      "The first game to use a sandbox concept was the 1984 game Elite.",  
      "The highest-grossing game franchise of all time is Grand Theft Auto.",  
      "The first game to use a battle royale mode was the 2017 game PlayerUnknown's Battlegrounds.",  
      "The first game to use a virtual reality (VR) headset was the 1995 game Virtual Boy.",  
      "The most popular game genre of all time is action-adventure.",  
      "The first game to use a massively multiplayer online (MMO) concept was the 1997 game Ultima Online.",  
      "The highest-rated game of all time is The Legend of Zelda: Breath of the Wild.",  
      "The first game to use a procedural generation was the 1984 game Elite.",  
      "The most popular game platform of all time is the PlayStation 2.",  
      "The first game to use a motion control was the 2006 game Wii Sports.",  
      "The highest-grossing game of all time is Grand Theft Auto V.",  
    ];  
    var randomFact = facts[Math.floor(Math.random() * facts.length)];  
    var msg = {  
      body: `My prefix is » ${global.config.PREFIX} «\nUse Help for list of commands.\nCurrent Time: ${gio}\nRandom Game Fact: ${randomFact}`,  
    };  
    api.sendMessage(msg, threadID, messageID);  
  }  
};  

module.exports.run = function({ api, event, client, __GLOBAL }) {}  
