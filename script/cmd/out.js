module.exports.config = {
  name: "out",
  version: "1.0.0",
  role: 2,
  hasPrefix: true,
  description: "Bot leaves the thread",
  usages: "out",
  cooldown: 0,
};

module.exports.run = async ({ api, event, args, admin }) => {
  const senderID = event.senderID.toString();
  if (!admin.includes(senderID)) {
    return api.sendMessage("𝖸𝗈𝗎 𝖽𝗈𝗇'𝗍 𝗁𝖺𝗏𝖾 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.", event.threadID, event.messageID);
  }
  try {
    if (!args[0]) {
      return await api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    } 
    if (!isNaN(args[0])) {
      return await api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
    }
    let threadInfo = await api.getThreadInfo(args.join(" "));
    api.sendMessage(`✅ Successfully left the thread.\n𝗧𝗵𝗿𝗲𝗮𝗱𝗡𝗮𝗺𝗲: ${threadInfo.threadName}\n𝗧𝗵𝗿𝗲𝗮𝗱𝗜𝗗: ${args.join(" ")}`, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`Error leaving the thread: ${error.message}`, event.threadID, event.messageID);
  }
};
