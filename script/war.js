module.exports.config = {
  name: "war",
  version: "1.0.0",
  role: 2, // 2 = Admin / Operator Only
  author: "Developer",
  description: "GC Name spammer at Auto-Reply Trash Talker",
  category: "war",
  guide: "{p}war [on/off] - I-on o i-off ang war mode.",
  cooldowns: 5
};

// Listahan ng mga trashtalk lines
const trashTalkList = [
  "Umiyak ka na lang dito haha!",
  "Ano ba yan, walang maipaglaban?",
  "Basura pa rin hanggang ngayon ah!",
  "Matulog ka na lang, hindi mo kaya 'to.",
  "Bakit ka nandito? Walang naghahanap sa'yo!",
  "Chat ka pa, wala namang may paki!"
];

// Global state para hindi mawala kapag nagre-reply
global.warBotState = global.warBotState || {
  active: false,
  interval: null,
  threadID: null
};

// 1. COMMAND EXECUTOR (/war O /war off)
module.exports.onStart = async function ({ api, event, args, message, role }) {
  const { threadID } = event;

  // Extra check kung Admin
  if (role < 2) {
    return message.reply("⚠️ Admin lang ang pwedeng gumamit ng war command!");
  }

  const action = args[0] ? args[0].toLowerCase() : "";

  // ON COMMAND (/war o /war on)
  if (action === "on" || action === "start" || !action) {
    if (global.warBotState.active) {
      return message.reply("🔥 War mode is ALREADY ACTIVE in this group!");
    }

    global.warBotState.active = true;
    global.warBotState.threadID = threadID;

    message.reply("🔥 WAR MODE ACTIVATED! Sisimulan na ang GC Name Trash-Talk at Auto-Reply...");

    let counter = 0;
    global.warBotState.interval = setInterval(() => {
      if (!global.warBotState.active) return;

      const randomPhrase = trashTalkList[Math.floor(Math.random() * trashTalkList.length)];
      const newGCName = `${randomPhrase} [${counter++}]`;

      api.setTitle(newGCName, threadID, (err) => {
        if (err) console.error("Failed to change GC Name:", err);
      });
    }, 3000); // Nagpapalit ng GC Name bawat 3 seconds

    return;
  }

  // OFF COMMAND (/war off O tinype lang ang "off")
  if (action === "off" || action === "stop") {
    if (!global.warBotState.active) {
      return message.reply("Naka-OFF naman na ang War Mode.");
    }

    global.warBotState.active = false;
    clearInterval(global.warBotState.interval);
    global.warBotState.interval = null;
    global.warBotState.threadID = null;

    return message.reply("🛑 WAR MODE DEACTIVATED! Huminto na ang spam.");
  }
};

// 2. AUTO-REPLY ON ANY CHAT (Iniiwasang ma-trigger pag nka-off)
module.exports.onChat = async function ({ api, event }) {
  if (!global.warBotState || !global.warBotState.active) return;

  const { threadID, senderID, body, type } = event;

  // Huwag sagutin kung galing sa sarili ng bot o walang text content
  if (type !== "message" || !body || senderID === api.getCurrentUserID()) return;

  // Huwag basahin ang "off" o "/war" para hindi ma-trashtalk ang admin habang nag-co-command
  const text = body.trim().toLowerCase();
  if (text === "off" || text.includes("/war")) return;

  const randomTrash = trashTalkList[Math.floor(Math.random() * trashTalkList.length)];

  api.sendMessage({
    body: randomTrash,
    mentions: [{
      tag: `@${senderID}`,
      id: senderID
    }]
  }, threadID);
};
