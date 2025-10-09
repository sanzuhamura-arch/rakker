const axios = require('axios');

module.exports.config = {
  name: "adduser",
  version: "1.0.1",
  role: 0,
  description: "Add user to group by id or Facebook link",
  hasPrefix: false,
  usage: "{p}adduser userid/fblink",
  cooldowns: 5,
  aliases: ["add"],
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const botID = api.getCurrentUserID();
  const out = msg => api.sendMessage(msg, threadID, messageID);
  var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
  var participantIDs = participantIDs.map(e => parseInt(e));

  if (!args[0]) return out("Please provide a user ID or Facebook link to add.");

  if (!isNaN(args[0])) return adduser(args[0], undefined);

  const fblink = args.join(" ");
  const response = await axios.get(`https://betadash-uploader.vercel.app/lookup?fblink=${fblink}`);
  const userID = response.data.code;

  if (!isNaN(userID)) return adduser(userID, undefined);

  async function adduser(id, name) {
    id = parseInt(id);
    if (participantIDs.includes(id)) return out(`${name ? name : "Member"} is already in the group.`);
    else {
      var admins = adminIDs.map(e => parseInt(e.id));
      try {
        await api.addUserToGroup(id, threadID);
      }
      catch {
        return out(`Can't add ${name ? name : "user"} in group.`);
      }
      if (approvalMode === true && !admins.includes(botID)) return out(`Added ${name ? name : "member"} to the approved list!`);
      else return out(`Added ${name ? name : "member"} to the group!`);
    }
  }
};
