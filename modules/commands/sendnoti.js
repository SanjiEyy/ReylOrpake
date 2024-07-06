module.exports.config = {
	name: "sendnoti",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "raku",
	description: "Send messages to groups!",
	commandCategory: "system",
	usages: "[Text]",
	cooldowns: 5
};

module.exports.languages = {
	"en": {
		"sendSuccess": "Sent message to %1 thread!",
		"sendFail": "[!] Can't send message to %1 thread"
	},
	"tl": {
		"sendSuccess": "Naipadala ang mensahe sa %1 thread!",
		"sendFail": "[!] Hindi maipadala ang mensahe sa %1 thread"
	}
};

module.exports.run = async ({ api, event, args, getText, language }) => {
	var allThread = global.data.allThreadID || [];
	var count = 1,
		cantSend = [];
	const adminName = global.data.adminName || "Admin"; // Get admin name from global data
	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	const formattedTime = currentDate.toLocaleTimeString(language, { hour: 'numeric', minute: 'numeric', second: 'numeric' });

	for (const idThread of allThread) {
		if (isNaN(parseInt(idThread)) || idThread == event.threadID) ""
		else {
			// Send English notification
			api.sendMessage(
				`\n📣 **Attention!** 📣\n\n**From:** ${adminName}\n**Date:** ${formattedDate}\n**Time:** ${formattedTime}\n\n${args.join(" ")}`,
				idThread,
				(error, info) => {
					if (error) cantSend.push(idThread);
				}
			);

			// Send Tagalog notification using Google Voice (assuming you have it set up)
			api.sendMessage(
				`📣 **Pansin!** 📣\n\n**Mula sa:** ${adminName}\n**Petsa:** ${formattedDate}\n**Oras:** ${formattedTime}\n\n${args.join(" ")}`,
				idThread,
				{
					attachment: fs.createReadStream("path/to/your/google/voice/file.mp3") // Replace with your Google Voice file path
				},
				(error, info) => {
					if (error) cantSend.push(idThread);
				}
			);

			count++;
			await new Promise(resolve => setTimeout(resolve, 500));
		}
	}
	return api.sendMessage(
		getText("sendSuccess", count),
		event.threadID,
		() =>
			cantSend.length > 0
				? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID)
				: "",
		event.messageID
	);
};