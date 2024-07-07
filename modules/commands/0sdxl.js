const axios = require('axios');

// Define the style list
const styleList = {
    "1": "anime",
    "2": "fantasy",
    "3": "pencil",
    "4": "digital",
    "5": "vintage",
    "6": "3d (render)",
    "7": "cyberpunk",
    "8": "manga",
    "9": "realistic",
    "10": "demonic",
    "11": "heavenly",
    "12": "comic",
    "13": "robotic"
};

module.exports.config = {
    name: "sdxl",
    version: "1.0.0",
    credits: "ChatGPT",
    description: "Generate styled text based on a query and style. Styles available: anime, fantasy, pencil, digital, vintage, 3d (render), cyberpunk, manga, realistic, demonic, heavenly, comic, robotic.",
    commandCategory: "text",
    usages: ["sdxl [query] [style]"],
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    let query = encodeURIComponent(args[0]); // Encode the query parameter
    let style = args[1]; // Style number or style name

    if (!query) {
        return api.sendMessage("Please provide a query to generate styled text.", threadID, messageID);
    }

    // Determine if the style is specified by number or name
    if (style) {
        style = style.toLowerCase(); // Convert style name to lowercase for consistency
        // Check if style is a number, if not, find the corresponding style number
        if (!Object.values(styleList).includes(style)) {
            const styleNumber = Object.keys(styleList).find(key => styleList[key].toLowerCase() === style);
            if (!styleNumber) {
                return api.sendMessage("Invalid style. Please provide a valid style number or style name.", threadID, messageID);
            }
            style = styleNumber;
        }
    } else {
        style = '1'; // Default to style 1 if no style is provided
    }

    try {
        // Fetch styled text data from the provided API endpoint
        const response = await axios.get(`https://joshweb.click/sdxl?q=${query}&style=${style}`);

        if (response.data && response.data.status === 200) {
            const styledText = response.data.result;

            // Send the styled text as a message
            return api.sendMessage(styledText, threadID, messageID);
        } else {
            return api.sendMessage("Sorry, I couldn't generate styled text for the provided query.", threadID, messageID);
        }
    } catch (error) {
        console.error("Error generating styled text:", error);
        return api.sendMessage("An error occurred while generating styled text. Please try again later.", threadID, messageID);
    }
};
