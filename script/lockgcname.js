const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "lockedNames.json");

function loadLocks() {
  try {
    if (!fs.existsSync(FILE)) {
      fs.mkdirSync(path.dirname(FILE), { recursive: true });
      fs.writeFileSync(FILE, "{}");
    }
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (e) {
    return {};
  }
}

function saveLocks(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "lockgcname",
  aliases: ["lockname", "namelock"],
  version: "1.0.0",
  hasPermission: 1, // baguhin depende sa permission system ng bot mo
  credits: "Sinzu",
  description: "Nag-lo-lock ng group name, ibabalik agad kapag pinalitan.",
  commandCategory: "admin",
  usages: "[on/off] [pangalan]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const messageID = event.messageID;
  const senderID = event.senderID;
  const locks = loadLocks();

  // ── Admin-only check ──
  const threadInfoForCheck = await new Promise((resolve) => {
    api.getThreadInfo(threadID, (err, info) => resolve(err ? null : info));
  });

  const adminIDs = (threadInfoForCheck?.adminIDs || []).map((a) =>
    typeof a === "object" ? a.id : a
  );

  if (!adminIDs.includes(senderID)) {
    return api.sendMessage(
      "❌ Group admins lang ang pwedeng gumamit ng command na ito.",
      threadID,
      messageID
    );
  }

  const sub = (args[0] || "").toLowerCase();

  // ── lockgcname off — i-unlock ──
  if (sub === "off") {
    delete locks[threadID];
    saveLocks(locks);
    return api.sendMessage("🔓 Na-unlock na ang pangalan ng group.", threadID, messageID);
  }

  // ── lockgcname on [pangalan] — i-lock sa binigay na pangalan ──
  // ── lockgcname [pangalan] — i-lock din, shortcut ──
  let lockedName;
  if (sub === "on") {
    lockedName = args.slice(1).join(" ");
  } else {
    lockedName = args.join(" ");
  }

  if (!lockedName) {
    // walang binigay na pangalan, gamitin yung current group name
    api.getThreadInfo(threadID, (err, info) => {
      if (err || !info) {
        return api.sendMessage("❌ Hindi makuha ang current group name.", threadID, messageID);
      }
      lockedName = info.threadName || "Group Chat";
      locks[threadID] = lockedName;
      saveLocks(locks);
      return api.sendMessage(
        `🔒 Na-lock ang pangalan ng group sa: "${lockedName}"`,
        threadID,
        messageID
      );
    });
    return;
  }

  locks[threadID] = lockedName;
  saveLocks(locks);

  api.setTitle(lockedName, threadID, (err) => {
    if (err) console.error("Error sa pag-set ng title:", err);
  });

  return api.sendMessage(
    `🔒 Na-lock ang pangalan ng group sa: "${lockedName}"`,
    threadID,
    messageID
  );
};

// ── Passive listener: babantayan ang pagbabago ng group name ──
module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:thread-name") return;

  const threadID = event.threadID;
  const locks = loadLocks();
  const lockedName = locks[threadID];

  if (!lockedName) return; // walang lock sa group na ito

  const newName = event.logMessageData?.name;
  if (newName === lockedName) return; // walang binago, tama pa rin

  // ibalik agad sa locked name
  api.setTitle(lockedName, threadID, (err) => {
    if (err) console.error("Error sa pag-restore ng group name:", err);
  });

  api.sendMessage(
    `🔒 Naka-lock ang pangalan ng group na ito. Ibinalik sa: "${lockedName}"`,
    threadID
  );
};
