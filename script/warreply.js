module.exports.config = {
  name: "warreply",
  version: "1.0.0",
  role: 2, // Admin Only
  author: "Developer",
  description: "Auto Reply Trash Talker",
  category: "war",
  guide: "/warreply [on/off]",
  cooldowns: 5
};

const trashTalkReplies = [
  "Umiyak ka na lang dito haha!",
  "Ano ba yan, walang maipaglaban?",
  "Basura pa rin hanggang ngayon ah!",
  "Matulog ka na lang, hindi mo kaya 'to.",
  "Bakit ka nandito? Walang naghahanap sa'yo!",
  "Chat ka pa, wala namang may paki!"
];

global.warReplyState = global.warReplyState || {
  active: false
};

module.exports.onStart = async function ({ args, message }) {
  const action = args[0] ? args[0].toLowerCase() : "";

  if (action === "on" || action === "start" || !action) {
    if (global.warReplyState.active) {
      return message.reply("🔥 Active na ang Auto-Reply!");
    }

    global.warReplyState.active = true;
    return message.reply("🔥 Auto-Reply ACTIVATED!");
  }

  if (action === "off" || action === "stop") {
    if (!global.warReplyState.active) {
      return message.reply("Naka-OFF na ang Auto-Reply.");
    }

    global.warReplyState.active = false;
    return message.reply("🛑 Auto-Reply DEACTIVATED!");
  }
};

module.exports.onChat = async function ({ api, event }) {
  if (!global.warReplyState || !global.warReplyState.active) return;

  const { threadID, senderID, body, type } = event;

  if (type !== "message" || !body || senderID === api.getCurrentUserID()) return;

  const text = body.trim().toLowerCase();
  if (text === "off" || text.includes("warreply")) return;

  const randomTrash = trashTalkReplies[Math.floor(Math.random() * trashTalkReplies.length)];

  api.sendMessage({
    body: randomTrash,
    mentions: [{ tag: `@${senderID}`, id: senderID }]
  }, threadID);
};
