module.exports.config = {
  name: "setname",
  aliases: ["setnick", "nickall"],
  version: "1.0.0",
  hasPermission: 1, // baguhin depende sa permission system ng bot mo
  credits: "Sinzu",
  description: "Ise-set ang parehong nickname sa lahat ng members ng group.",
  commandCategory: "admin",
  usages: "[nickname]",
  cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const messageID = event.messageID;
  const senderID = event.senderID;

  // ── Admin-only check ──
  const threadInfoForCheck = await new Promise((resolve) => {
    api.getThreadInfo(threadID, (err, info) => resolve(err ? null : info));
  });

  const adminIDs = (threadInfoForCheck?.adminIDs || []).map((a) =>
    typeof a === "object" ? a.id : a
  );

  if (!adminIDs.includes(senderID)) {
    return api.sendMessage(
      "❌ Group admins lang ang pwedeng gumamit ng command na ito.",
      threadID,
      messageID
    );
  }

  if (!args[0]) {
    return api.sendMessage(
      "❌ Maglagay ng nickname.\nHalimbawa: /setname Sinzu Gang",
      threadID,
      messageID
    );
  }

  const nickname = args.join(" ");

  api.getThreadInfo(threadID, async (err, info) => {
    if (err || !info) {
      return api.sendMessage("❌ Hindi makuha ang info ng group.", threadID, messageID);
    }

    const members = info.participantIDs || info.userInfo?.map((u) => u.id) || [];

    if (members.length === 0) {
      return api.sendMessage("❌ Walang nakitang members.", threadID, messageID);
    }

    await api.sendMessage(
      `⏳ Sinisimulan ang pag-set ng nickname na "${nickname}" sa ${members.length} members...`,
      threadID
    );

    let success = 0;
    let failed = 0;

    for (const uid of members) {
      try {
        await new Promise((resolve, reject) => {
          api.changeNickname(nickname, threadID, uid, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
        success++;
      } catch (e) {
        failed++;
      }

      // maliit na delay para maiwasan ang rate-limit
      await new Promise((r) => setTimeout(r, 1500));
    }

    return api.sendMessage(
      `✅ Tapos na!\n` +
        `Successful: ${success}\n` +
        `Failed: ${failed}`,
      threadID
    );
  });
};
