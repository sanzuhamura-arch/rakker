module.exports.config = {
  name: "warname",
  version: "1.0.0",
  role: 2, // Admin Only
  author: "Developer",
  description: "Continuous GC Name Spammer",
  category: "war",
  guide: "/warname [on/off]",
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
  interval: null
};

module.exports.onStart = async function ({ api, event, args, message }) {
  const { threadID } = event;
  const action = args[0] ? args[0].toLowerCase() : "";

  if (action === "on" || action === "start" || !action) {
    if (global.warNameState.active) {
      return message.reply("🔥 Active na ang GC Name Spammer!");
    }

    global.warNameState.active = true;
    message.reply("🔥 GC Name Spammer ACTIVATED!");

    let counter = 0;
    global.warNameState.interval = setInterval(() => {
      if (!global.warNameState.active) return;

      const randomPhrase = trashTalkNames[Math.floor(Math.random() * trashTalkNames.length)];
      const newGCName = `${randomPhrase} [${counter++}]`;

      api.setTitle(newGCName, threadID, (err) => {
        if (err) console.error("Error setting title:", err);
      });
    }, 3000);

    return;
  }

  if (action === "off" || action === "stop") {
    if (!global.warNameState.active) {
      return message.reply("Naka-OFF na ang GC Name Spammer.");
    }

    global.warNameState.active = false;
    clearInterval(global.warNameState.interval);
    global.warNameState.interval = null;

    return message.reply("🛑 GC Name Spammer DEACTIVATED!");
  }
};
