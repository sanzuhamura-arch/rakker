module.exports.config = {
  name: "nickall",
  version: "1.0.0",
  hasPermission: 0,
  credits: "you",
  description: "Nagpapalit ng nickname ng LAHAT ng miyembro ng GC. May delay sa pagitan ng bawat pagpapalit para hindi ma-rate limit/error kahit malaking grupo (200+ members).",
  commandCategory: "group",
  usages: "<bagong nickname>",
  cooldowns: 10,
};

// Simple delay helper
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prefix = global.config?.PREFIX || "/";

  const newNickname = args.join(" ");
  if (!newNickname) {
    return api.sendMessage(
      `Gamitin: ${prefix}nickall <bagong nickname>\n` +
      `Halimbawa: ${prefix}nickall 😴 Sleeping Gang`,
      threadID,
      messageID
    );
  }

  let threadInfo;
  try {
    threadInfo = await api.getThreadInfo(threadID);
  } catch (err) {
    return api.sendMessage("❌ Hindi makuha ang info ng thread.", threadID, messageID);
  }

  const memberIDs = threadInfo.participantIDs || [];
  const total = memberIDs.length;

  await api.sendMessage(
    `⏳ Sisimulan na palitan ang nickname ng ${total} members. Ito ay tatagal ng ilang minuto para maiwasan ang error — huwag itong iistorbohin.`,
    threadID,
    messageID
  );

  let success = 0;
  let failed = 0;

  for (let i = 0; i < memberIDs.length; i++) {
    const userID = memberIDs[i];
    try {
      await api.changeNickname(newNickname, threadID, userID);
      success++;
    } catch (err) {
      failed++;
      console.log(`Hindi napalitan ang nickname ni ${userID}:`, err?.message || err);
    }

    // Delay ng 2 segundo sa pagitan ng bawat pagpapalit — ito ang susi para
    // hindi ma-rate limit ang bot kahit malaki ang grupo (200-250 members).
    // Pwede mong tagalan pa (3000-5000ms) kung madalas pa ring nag-e-error.
    await sleep(2000);
  }

  return api.sendMessage(
    `✅ Tapos na! ${success}/${total} matagumpay na napalitan ang nickname.` +
    (failed > 0 ? `\n⚠️ ${failed} hindi napalitan (baka admin sila o walang permission ang bot).` : ""),
    threadID
  );
};
