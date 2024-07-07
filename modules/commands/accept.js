const { join } = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const moment = require('moment-timezone');

module.exports.config = {
    name: "acp",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "BLACK",
    description: "Make friends via Facebook ID",
    commandCategory: "admin",
    usages: "uid",
    cooldowns: 0
};

module.exports.handleReply = async function ({ handleReply, event, api }) {
    const { author, listRequest } = handleReply;
    if (author != event.senderID) return;

    const args = event.body.trim().toLowerCase().split(" ");
    const action = args[0];
    let targetIDs = args.slice(1);

    if (action !== "add" && action !== "del") {
        return api.sendMessage("Please select <add | del> <order number | \"all\">", event.threadID, event.messageID);
    }

    const form = {
        av: api.getCurrentUserID(),
        fb_api_caller_class: "RelayModern",
        variables: {
            input: {
                source: "friends_tab",
                actor_id: api.getCurrentUserID(),
                client_mutation_id: Math.round(Math.random() * 19).toString()
            },
            scale: 3,
            refresh_num: 0
        }
    };

    if (action === "add") {
        form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
        form.doc_id = "3147613905362928";
    } else if (action === "del") {
        form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
        form.doc_id = "4108254489275063";
    }

    if (targetIDs[0] === "all") {
        targetIDs = listRequest.map((_, index) => index + 1);
    }

    const success = [];
    const failed = [];
    const promiseFriends = [];

    for (const id of targetIDs) {
        const request = listRequest[parseInt(id) - 1];
        if (!request) {
            failed.push(`Order ${id} was not found in the list`);
            continue;
        }

        form.variables.input.friend_requester_id = request.node.id;
        const requestForm = JSON.stringify(form);
        promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", requestForm));
    }

    const responses = await Promise.allSettled(promiseFriends);

    responses.forEach((response, index) => {
        const request = listRequest[parseInt(targetIDs[index]) - 1];
        if (response.status === "fulfilled" && !JSON.parse(response.value).errors) {
            success.push(request.node.name);
        } else {
            failed.push(request.node.name);
        }
    });

    api.sendMessage(`» Successfully ${action === 'add' ? 'accepted' : 'deleted'} ${success.length} friend requests:\n${success.join("\n")}\n» Failed to ${action === 'add' ? 'accept' : 'delete'} ${failed.length} friend requests:\n${failed.join("\n")}`, event.threadID, event.messageID);
};

module.exports.run = async function ({ event, api }) {
    const form = {
        av: api.getCurrentUserID(),
        fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
        fb_api_caller_class: "RelayModern",
        doc_id: "4499164963466303",
        variables: JSON.stringify({ input: { scale: 3 } })
    };

    const response = await api.httpPost("https://www.facebook.com/api/graphql/", form);
    const listRequest = JSON.parse(response).data.viewer.friending_possibilities.edges;

    let msg = "";
    let i = 0;
    for (const user of listRequest) {
        i++;
        msg += (`\n${i}. Name: ${user.node.name}`
              + `\nID: ${user.node.id}`
              + `\nURL: ${user.node.url.replace("www.facebook", "fb")}`
              + `\nTime: ${moment(user.time * 1000).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n`);
    }

    api.sendMessage(`${msg}\nReply to this message with: <add | del> <order number | "all"> to take action.`, event.threadID, (err, info) => {
        if (err) return console.error(err);
        global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            listRequest,
            author: event.senderID
        });
    }, event.messageID);
};
