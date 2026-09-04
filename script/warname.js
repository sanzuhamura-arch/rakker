// Prefix: "/"
const PREFIX = "/"; 

module.exports.config = {
  name: "warname",
  version: "1.0.0",
  role: 2, // 2 = Admin Only
  author: "Developer",
  description: "Continuous GC Name Spammer",
  category: "war",
  guide: `${PREFIX}warname [on/off]`,
  cooldowns: 5
};

const trashTalkNames = [
  "Umiyak ka na lang dito haha!",
  "Ano ba yan, walang maipaglaban?",
  "Basura pa rin hanggang ngayon ah!",
  "Matulog ka na lang, hindi mo kaya 'to.",
  "Bakit ka nandito? Walang naghahanap sa'yo!",
  "Chat ka pa, wala namang may paki!"
];

global.warNameState = global.warNameState || {
  active: false,
  interval: null,
  threadID: null
};

module.exports.onStart = async function ({ api, event, args, message, role }) {
  const { threadID } = event;

  if (role < 2) {
    return message.reply("⚠️ Admin lang ang pwedeng mag-control ng GC Name spammer!");
  }

  const action = args[0] ? args[0].toLowerCase() : "";

  // ON COMMAND (/warname o /warname on)
  if (action === "on" || action === "start" || !action) {
    if (global.warNameState.active) {
      return message.reply("🔥 GC Name Spammer is ALREADY ACTIVE!");
    }

    global.warNameState.active = true;
    global.warNameState.threadID = threadID;

    message.reply("🔥 GC Name Spammer ACTIVATED! Nagsisimula na...");

    let counter = 0;
    global.warNameState.interval = setInterval(() => {
      if (!global.warNameState.active) return;

      const randomPhrase = trashTalkNames[Math.floor(Math.random() * trashTalkNames.length)];
      const newGCName = `${randomPhrase} [${counter++}]`;

      api.setTitle(newGCName, threadID, (err) => {
        if (err) console.error("Failed to change GC Name:", err);
      });
    }, 3000);

    return;
  }

  // OFF COMMAND (/warname off o "off")
  if (action === "off" || action === "stop") {
    if (!global.warNameState.active) {
      return message.reply("Naka-OFF naman na ang GC Name Spammer.");
    }

    global.warNameState.active = false;
    clearInterval(global.warNameState.interval);
    global.warNameState.interval = null;
    global.warNameState.threadID = null;

    return message.reply("🛑 GC Name Spammer DEACTIVATED!");
  }
};
