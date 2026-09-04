const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "sleeping",
  version: "2.0.0",
  hasPermission: 0,
  credits: "you",
  description: "Toggle sleeping mode autoreply on/off — nagre-reply ng 'ops... ZzZzZzZzZ' sa lahat ng magmemessage. Persistent, hindi mawawala kahit mag-restart ang bot.",
  commandCategory: "fun",
  usages: "[on/off]",
  cooldowns: 3,
};

// Persistent storage — naka-save sa JSON file, kaya hindi mawawala kahit mag-restart ang bot
const DATA_FILE = path.join(__dirname, "sleeping_data.json");

function loadThreads() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf8");
      return new Set(JSON.parse(raw));
    }
  } catch (err) {
    console.log("Hindi ma-load ang sleeping_data.json:", err);
  }
  return new Set();
}

function saveThreads(threadsSet) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify([...threadsSet]), "utf8");
  } catch (err) {
    console.log("Hindi ma-save ang sleeping_data.json:", err);
  }
}

// Load agad pagka-start ng bot, para live na agad ang mga naka-ON na thread dati
let sleepingThreads = loadThreads();

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
  const prefix = global.config?.PREFIX || "/";

  if (option === "on") {
    sleepingThreads.add(threadID);
    saveThreads(sleepingThreads);
    return api.sendMessage(
      "😴 Naka-ON na ang sleeping mode dito, permanente ito hangga't hindi mo in-off — kahit mag-restart pa ang bot.",
      threadID,
      messageID
    );
  }

  if (option === "off") {
    sleepingThreads.delete(threadID);
    saveThreads(sleepingThreads);
    return api.sendMessage("🌙 Naka-OFF na ang sleeping mode.", threadID, messageID);
  }

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
