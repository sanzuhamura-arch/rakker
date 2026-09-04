module.exports.config = {
  name: "war",
  aliases: ["war1", "off"],
  version: "1.2.0",
  hasPermission: 1,
  credits: "Sinzu",
  description: "Mabilis na auto-reply at mabilis na GC Name trashtalk changer.",
  commandCategory: "admin",
  usages: "[war / war1 <gc name> / off]",
  cooldowns: 0
};

global.warState = global.warState || {
  allAutoReply: {},
  gcNameWar: {}
};

const trashtalkLines = [
  "Bakit ka tahimik? Labas mo tapang mo!",
  "Iyakin ka pala eh, konting pikit lang palag ka na?",
  "Hanggang diyan ka lang ba? Isip ka muna!",
  "Walang kwenta kausap, puro hangin lang!",
  "Baka gusto mong mag-review muna bago ka lumaban!",
  "Tulog ka na lang, umiiyak ka na naman eh!",
  "Ganyan ba talaga kapag mahina? Puro palusot!",
  "Masyado kang mabagal, mag-type ka naman!",
  "Palag pa! Wag kang tatalikod dito!"
];

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  // ── Admin-only check ──
  const threadInfo = await new Promise((resolve) => {
    api.getThreadInfo(threadID, (err, info) => resolve(err ? null : info));
  });

  const adminIDs = (threadInfo?.adminIDs || []).map((a) =>
    typeof a === "object" ? a.id : a
  );

  if (!adminIDs.includes(senderID)) {
    return api.sendMessage(
      "❌ Group admins lang ang pwedeng gumamit nito.",
      threadID,
      messageID
    );
  }

  const commandUsed = event.body.trim().split(" ")[0].toLowerCase().replace("/", "");

  // ── COMMAND: /off ──
  if (commandUsed === "off" || args[0] === "off") {
    global.warState.allAutoReply[threadID] = false;
    global.warState.gcNameWar[threadID] = false;

    return api.sendMessage(
      "🛑 [WAR SYSTEM] OFF NA LAHAT.",
      threadID,
      messageID
    );
  }

  // ── COMMAND: /war1 (Fast GC Name Changer) ──
  if (commandUsed === "war1" || args[0] === "1") {
    const baseName = args.join(" ");

    if (!baseName) {
      return api.sendMessage(
        "❌ Maglagay ng GC Name.\nHalimbawa: /war1 SINZU GANG",
        threadID,
        messageID
      );
    }

    if (global.warState.gcNameWar[threadID]) {
      return api.sendMessage("⚠️ Naka-ON na ang GC Name War! Gamitin ang /off para ihinto.", threadID, messageID);
    }

    global.warState.gcNameWar[threadID] = true;
    api.sendMessage(`⚡ [FAST GC NAME WAR ACTIVATED] Mode: ${baseName}`, threadID);

    let index = 0;
    
    // Fast Loop Execution
    const runFastNameChange = async () => {
      while (global.warState.gcNameWar[threadID]) {
        const line = trashtalkLines[index % trashtalkLines.length];
        const newTitle = `${baseName} - ${line}`;

        api.setTitle(newTitle, threadID, () => {});
        index++;

        // 100ms interval para sa napakabilis na palit ng name
        await new Promise((res) => setTimeout(res, 100)); 
      }
    };

    runFastNameChange();
    return;
  }

  // ── COMMAND: /war (Fast Auto-Reply sa KAHIT SINO) ──
  global.warState.allAutoReply[threadID] = true;

  return api.sendMessage(
    "⚡ [FAST ALL-CHAT WAR ACTIVATED] Bawat mag-chat, aawtuhin agad!",
    threadID,
    messageID
  );
};

// ── Instant Listener for Auto-Reply ──
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body, messageID } = event;

  if (!body || senderID === api.getCurrentUserID()) return;

  if (global.warState.allAutoReply[threadID]) {
    const randomLine = trashtalkLines[Math.floor(Math.random() * trashtalkLines.length)];
    // Walang delay, rekta send agad sa message reply
    api.sendMessage(randomLine, threadID, messageID);
  }
};
