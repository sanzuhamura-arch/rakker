const axios = require('axios');

module.exports.config = {
  name: "uid",
  role: 0,
  description: "Get the user's Facebook UID.",
  hasPrefix: false,
  usages: "{p}uid {p}uid @mention {p}uid fblink",
  cooldown: 5,
  aliases: ["id","fbid","userid"],
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (args.length === 0) {
      if (event.messageReply) {
        const senderID = event.messageReply.senderID;
        return api.shareContact(senderID, event.messageReply.senderID, event.threadID);
      } else {
        return api.shareContact(` ${event.senderID}`, event.senderID, event.threadID);
      }
    } else if (Object.keys(event.mentions).length === 0) {
      const fblink = args.join(" ");
      const response = await axios.get(`https://betadash-uploader.vercel.app/lookup?fblink=${fblink}`);
      return api.shareContact(response.data.code, response.data.code, event.threadID);
    } else {
      for (const mentionID in event.mentions) {
        const { mentions } = event;
        for (const id in mentions) {
          api.shareContact(`${mentions[id].replace("@", "")}: ${mentionID}`, mentionID, event.threadID);
        }
      }
    }
  } catch (err) {
    return api.sendMessage('Cannot get userID', event.threadID, event.messageID);
  }
};
