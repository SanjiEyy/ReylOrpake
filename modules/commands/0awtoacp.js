const moment = require('moment-timezone');

module.exports.config = {
    name: "autoacceptfriend",
    version: "1.0.0",
    credits: "YourName",
    description: "Automatically accept friend requests and greet the requester.",
    commandCategory: "admin", // Adjust the category as needed
    adminOnly: true, // Only admins can use this command
    usages: ["!autoacceptfriend - Automatically accept friend requests and greet the requester."],
};

module.exports.run = async function({ api, event }) {
    const { threadID, senderID } = event;

    try {
        // Get the list of friend requests
        const friendRequests = await api.getFriendRequests();

        // Iterate through each friend request
        for (const request of friendRequests) {
            // Accept the friend request
            await api.acceptFriendRequest(request.userID);

            // Get current date and time in Manila timezone
            const now = moment().tz('Asia/Manila');

            // Calculate days since the friend request
            const requestDate = moment.unix(request.timestamp);
            const daysSinceRequest = now.diff(requestDate, 'days');

            // Generate a greeting message
            const greetingMessage = `Hello! Thank you for adding me as a friend.\n\n🕒 Current Date and Time (Manila): ${now.format('YYYY-MM-DD HH:mm:ss')}\n📅 Days since you sent the request: ${daysSinceRequest}`;

            // Send the greeting message to the requester
            await api.sendMessage(greetingMessage, request.userID);
        }

        // Confirmation message to the admin
        api.sendMessage("Friend requests accepted and greetings sent.", threadID);
    } catch (error) {
        console.error("Error accepting friend request or sending greeting:", error);
        api.sendMessage(`An error occurred: ${error.message}`, threadID);
    }
};
