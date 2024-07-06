const fs = require("fs");
module.exports.config = {
	name: "sad",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "John Lester", 
	description: "Just Respond",
	commandCategory: "no prefix",
	cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	let react = event.body.toLowerCase();
	const sadWords = ["sad", "😭", "sakit", "pain", "💔", "🙂", "wala pera", "ang sakit", "break", "😢", "ayaw kuna", "😿", "😥", "😰", "😨", "😔", "😞", "depression", "stress", "Depress", "sigma", "Single", "single"]; // Array of sad words

	// Check if the message starts with any of the sad words
	if (sadWords.some(word => react.startsWith(word))) { 
		var msg = {
			body: "sorry na wag kanang malungkot uwu" 
		}
		api.sendMessage(msg, threadID, messageID);
		api.setMessageReaction("😢", event.messageID, (err) => {}, true)
	}
}
module.exports.run = function({ api, event, client, __GLOBAL }) {

}