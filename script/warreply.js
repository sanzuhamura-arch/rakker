module.exports.config = {
  name: "warreply",
  version: "1.0.0",
  role: 2, // 2 = Admin Only
  author: "Developer",
  description: "Auto-Reply Trash Talker sa bawat mag-chat",
  category: "war",
  guide: "{p}warreply [on/off]",
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
  active: false,
  threadID: null
};

module.exports.onStart = async function ({ api, event, args, message, role }) {
  const { threadID } = event;

  if (role < 2) {
    return message.reply("⚠️ Admin lang ang pwedeng mag-control ng Auto-Reply war!");
  }

  const action = args[0] ? args[0].toLowerCase() : "";

  // ON COMMAND (/warreply o /warreply on)
  if (action === "on" || action === "start" || !action) {
    if (global.warReplyState.active) {
      return message.reply("🔥 Auto-Reply Trash Talker is ALREADY ACTIVE!");
    }

    global.warReplyState.active = true;
    global.warReplyState.threadID = threadID;

    return message.reply("🔥 Auto-Reply Trash Talker ACTIVATED! Titirahin ang bawat mag-chat...");
  }

  // OFF COMMAND (/warreply off)
  if (action === "off" || action === "stop") {
    if (!global.warReplyState.active) {
      return message.reply("Naka-OFF naman na ang Auto-Reply Trash Talker.");
    }

    global.warReplyState.active = false;
    global.warReplyState.threadID = null;

    return message.reply("🛑 Auto-Reply Trash Talker DEACTIVATED!");
  }
};

// Auto-Reply Listener
module.exports.onEvent = async function ({ api, event }) {
  if (!global.warReplyState || !global.warReplyState.active) return;

  const { threadID, senderID, body, type } = event;

  // Wag basahin ang sariling chat ng bot at dapat text message lang
  if (type !== "message" || !body || senderID === api.getCurrentUserID()) return;

  // Iwasan ma-trigger sa off/command
  const text = body.trim().toLowerCase();
  if (text === "off" || text.includes("warreply")) return;

  const randomTrash = trashTalkReplies[Math.floor(Math.random() * trashTalkReplies.length)];

  api.sendMessage({
    body: randomTrash,
    mentions: [{
      tag: `@${senderID}`,
      id: senderID
    }]
  }, threadID);
};
