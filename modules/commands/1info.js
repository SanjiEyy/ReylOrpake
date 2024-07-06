module.exports.config = {
	name: "info",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "Joshua Sy", //don't change the credits please
	description: "Admin and Bot info.",
	commandCategory: "...",
	cooldowns: 1,
	dependencies: 
	{
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Manila").format("『D/MM/YYYY』 【hh:mm:ss】");
var link =["https://i.postimg.cc/SKQhmJqK/917f3a5fd9f381f7537c9b6eab495e64.jpg", 
            
            "https://i.postimg.cc/YqpK6vGz/2c0c54c55200025fd19d67b7ab20a095.jpg", 
            
            "https://i.postimg.cc/C1FHPpjX/e5ed4bf9951c2979ac35be7e445d271c.jpg",

            "https://i.postimg.cc/52Ch1LZ1/abe93e3b5644fb0a4692007767ed4fd5.jpg",
       
              "https://i.postimg.cc/CLm1kT1d/ca3699a91efd4aa820aa7280f191b676.jpg",

                    "https://i.postimg.cc/ZqypwKBw/Picsart-23-02-01-00-11-17-278.jpg"];
  
var callback = () => api.sendMessage({body:`ADMIN AND BOT INFORMATION 

BOT NAME : ${global.config.BOTNAME}

BOT ADMIN : 『Zeeshan Altaf』

FACEBOOK : https://www.facebook.com/zeeshanofficial01

BOT PREFIX : ${global.config.PREFIX}

BOT OWNER : 『Zeeshan Altaf』 

➟ UPTIME

TODAY IS TIME : ${juswa} 

BOT IS RUNNING ${hours}:${minutes}:${seconds}.

THANKS FOR USING ${global.config.BOTNAME} 『🙅🖤』`,attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/juswa.jpg")).on("close",() => callback());
   };