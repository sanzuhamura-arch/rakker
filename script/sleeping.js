module.exports.config = {
  name: "sleeping",
  version: "1.0.0",
  hasPermission: 0,
  credits: "you",
  description: "Toggle sleeping mode autoreply on/off — nagre-reply ng 'ops... ZzZzZzZzZ' sa lahat ng magmemessage.",
  commandCategory: "fun",
  usages: "[on/off]",
  cooldowns: 3,
};

// In-memory storage kung saang thread naka-ON
// (mawawala pag nag-restart; pwede gawing json/database kung gusto persistent)
const sleepingThreads = new Set();

// Sleeping-themed lines lang — light, walang insults na personal o mean
const sleepingReplies = [
  "ops... ZzZzZzZzZ 😴",
  "ZzZzZzZzZ... huh? ano na naman?",
  "ops, natulog ako saglit, ZzZzZzZzZ",
  "ZzZzZzZzZ 💤 huwag mo akong gisingin.",
  "ops sorry, tulog mode pa ako ZzZzZzZzZ",
  "ZzZzZzZzZ... (di talaga nakikinig)",
  "ops ano raw? ZzZzZzZzZ",
  "ZzZzZzZzZ 😴 paalam sa mundo saglit.",
];

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const option = args[0] ? args[0].toLowerCase() : null;

  if (option === "on") {
    sleepingThreads.add(threadID);
    return api.sendMessage("😴 Naka-ON na ang sleeping mode dito, ingat kayo mga chat!", threadID, messageID);
  }

  if (option === "off") {
    sleepingThreads.delete(threadID);
    return api.sendMessage("🌙 Naka-OFF na ang sleeping mode.", threadID, messageID);
  }

  const prefix = global.config?.PREFIX || "/";
  return api.sendMessage(
    `Gamitin: ${prefix}sleeping on | ${prefix}sleeping off`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body } = event;

  if (!sleepingThreads.has(threadID)) return;
  if (!body) return;
  if (senderID === api.getCurrentUserID()) return;

  const randomReply = sleepingReplies[Math.floor(Math.random() * sleepingReplies.length)];
  api.sendMessage(randomReply, threadID);
};
