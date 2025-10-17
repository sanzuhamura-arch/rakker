const moment = require("moment-timezone");

const a = {};

a["config"] = {
    name: "accept",
    aliases: ['acp'],
    version: "1.0",
    role: 2,
    hasPrefix: false,
    cooldown: 8,
    description: "accept users",
    commandCategory: "Utility",
    usage: "{p}{n}acp list || {p}{n}acp confirm <number> || {p}{n}acp delete <number> || {p}{n}accept confirm all || {p}{n}accept delete all"
};

a["run"] = async ({ api, event, args, prefix, admin }) => { 
    const senderID = event.senderID.toString();
    if (!admin.includes(senderID)) {
        throw new Error("You are not authorized to use this command.");
    }

    const form = { 
        av: api.getCurrentUserID(), 
        fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader", 
        fb_api_caller_class: "RelayModern", 
        doc_id: "4499164963466303", 
        variables: JSON.stringify({ input: { scale: 3 } }) 
    };

    const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;

    if (args[0] === "list") {
        let msg = "";
        let i = 0;
        for (const user of listRequest) {
            i++;
            msg += `[ ${i} ]\n𝗡𝗔𝗠𝗘: ${user.node.name}\n𝗜𝗗: ${user.node.id}\n𝗣𝗿𝗼𝗳𝗶𝗹𝗲_𝗨𝗿𝗹: ${user.node.url.replace("www.facebook", "fb")}\nTime: ${moment(user.time * 1009).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n\n`;
        }
        return api.sendMessage(`${msg}`, event.threadID, event.messageID);
    }

    const formMutation = { 
        av: api.getCurrentUserID(), 
        fb_api_caller_class: "RelayModern", 
        variables: { input: { source: "friends_tab", actor_id: api.getCurrentUserID(), client_mutation_id: Math.round(Math.random() * 19).toString() }, scale: 3, refresh_num: 0 } 
    };

    const success = [];
    const failed = [];

    if (args[0] === "confirm") {
        formMutation.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
        formMutation.doc_id = "3147613905362928";
    } else if (args[0] === "delete") {
        formMutation.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
        formMutation.doc_id = "4108254489275063";
    } else {
        return api.sendMessage(`Please Use: ${prefix}acp <list>\n${prefix}acp <confirm> <number>\n${prefix}acp <delete> <number>\n${prefix}acp <confirm> <all>\n${prefix}acp <delete> <all>`, event.threadID, event.messageID);
    }

    let targetIDs = args.slice(1);
    if (args[1] === "all") {
        targetIDs = [];
        const lengthList = listRequest.length;
        for (let i = 1; i <= lengthList; i++) targetIDs.push(i);
    }

    const newTargetIDs = [];
    const promiseFriends = [];

    for (const stt of targetIDs) {
        const index = parseInt(stt) - 1; 
        const u = listRequest[index];
        if (!u) {
            failed.push(`Can't find entry ${stt} in the list`);
            continue;
        }
        formMutation.variables.input.friend_requester_id = u.node.id;
        formMutation.variables = JSON.stringify(formMutation.variables);
        newTargetIDs.push(u);
        promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", formMutation));
        formMutation.variables = JSON.parse(formMutation.variables);
    }

    const lengthTarget = newTargetIDs.length;

    for (let i = 0; i < lengthTarget; i++) {
        try {
            const friendRequest = await promiseFriends[i];
            if (JSON.parse(friendRequest).errors) {
                failed.push(newTargetIDs[i].node.name);
            } else {
                success.push(newTargetIDs[i].node.name);
            }
        } catch (e) {
            failed.push(newTargetIDs[i].node.name);
        }
    }

    if (success.length > 0) {
        api.sendMessage(
            `» The ${args[0] === 'confirm' ? 'friend request confirmation' : 'friend request deletion'} was successful for ${success.length} people:\n\n${success.join("\n")}${failed.length > 0 ? `\n» Errors encountered for ${failed.length} people: ${failed.join("\n")}` : ""}`, 
            event.threadID, 
            event.messageID
        );
    } else {
        api.unsendMessage(event.messageID);
        return api.sendMessage("No valid responses received. Please try again.", event.threadID);
    }

    api.unsendMessage(event.messageID);
};

module.exports = a;
