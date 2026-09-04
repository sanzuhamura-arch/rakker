module.exports.config = {
  name: "war",
  version: "1.0.0",
  role: 2, // 2 = Admin / Operator Only
  author: "Developer",
  description: "GC Name spammer at Auto Reply Trash-Talker",
  category: "war",
  guide: "{p}war [on/off]",
  cooldowns: 5
};

// Listahan ng gagamiting trashtalk lines
const trashTalkList = [
  "Umiyak ka na lang dito haha!",
  "Ano ba yan, walang maipaglaban?",
  "Basura pa rin hanggang ngayon ah!",
  "Matulog ka na lang, hindi mo kaya 'to.",
  "Bakit ka nandito? Walang naghahanap sa'yo!",
  "Chat ka pa, wala namang may paki!"
];

// Global State Variable
global.rakkerWarState = global.rakkerWarState || {
  active: false,
  interval: null,
  threadID: null
};

// 1. COMMAND EXECUTION (/war & /war off)
module.exports.onStart = async function ({ api, event, args, message, role }) {
  const { threadID } = event;

  if (role < 2) {
    return message.reply("⚠️ Admin lang ang pwedeng mag-control ng War Mode!");
  }

  const action = args[0] ? args[0].toLowerCase() : "";

  // ON COMMAND (/war o /war on)
  if (action === "on" || action === "start" || !action) {
    if (global.rakkerWarState.active) {
      return message.reply("🔥 War Mode is ALREADY ACTIVE!");
    }

    global.rakkerWarState.active = true;
    global.rakkerWarState.threadID = threadID;

    message.reply("🔥 WAR MODE ACTIVATED! Sisimulan na ang GC Name Trash-Talk at Auto-Reply...");

    let counter = 0;
    global.rakkerWarState.interval = setInterval(() => {
      if (!global.rakkerWarState.active) return;

      const randomPhrase = trashTalkList[Math.floor(Math.random() * trashTalkList.length)];
      const newGCName = `${randomPhrase} [${counter++}]`;

      api.setTitle(newGCName, threadID, (err) => {
        if (err) console.error("Failed to change GC Name:", err);
      });
    }, 3000); // 3 seconds interval

    return;
  }

  // OFF COMMAND (/war off o "off")
  if (action === "off" || action === "stop") {
    if (!global.rakkerWarState.active) {
      return message.reply("Naka-OFF naman na ang War Mode.");
    }

    global.rakkerWarState.active = false;
    clearInterval(global.rakkerWarState.interval);
    global.rakkerWarState.interval = null;
    global.rakkerWarState.threadID = null;

    return message.reply("🛑 WAR MODE DEACTIVATED! Huminto na ang spam.");
  }
};

// 2. AUTO-REPLY LISTENER (Tinatrashtalk ang kahit kaninong mag-chat habang active)
module.exports.onEvent = async function ({ api, event }) {
  if (!global.rakkerWarState || !global.rakkerWarState.active) return;

  const { threadID, senderID, body, type } = event;

  // Siguraduhing text message at hindi bot account ang nag-chat
  if (type !== "message" || !body || senderID === api.getCurrentUserID()) return;

  // Huwag pansinin ang /war at off commands
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
