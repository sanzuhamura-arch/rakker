const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "bot",
  version: "5.0.0",
  hasPermission: 0,
  credits: "you",
  description: "Toggle roast autoreply mode.",
  commandCategory: "fun",
  usages: "on/off",
  cooldowns: 3,
};

const DATA_FILE = path.join(__dirname, "sleeping_data.json");

function loadThreads() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      return new Set(Array.isArray(data) ? data : []);
    }
  } catch (err) {
    console.log("Failed to load sleeping_data.json:", err);
  }

  return new Set();
}

function saveThreads(set) {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify([...set], null, 2),
      "utf8"
    );
  } catch (err) {
    console.log("Failed to save sleeping_data.json:", err);
  }
}

let sleepingThreads = loadThreads();

/*
 * 100 ORIGINAL ENGLISH ROASTS
 */
const roastReplies = [
  "Bro really typed that and thought it was a good idea 💀",
  "Your message has the same energy as a phone at 1% 🔋😭",
  "Bro, even autocorrect gave up on you 💀📱",
  "That message needs a refund 😭💸",
  "You dropped a message, but forgot to bring the personality 😂",
  "Bro is fighting for his life against the keyboard 💀⌨️",
  "I've seen loading screens with more progress than this 😭",
  "Your WiFi isn't the problem, your thoughts are 💀📡",
  "Bro cooked nothing and still burned the kitchen 🔥😭",
  "That was almost funny. Almost. 💀",
  "Your message just lowered the group IQ by 2 points 😭📉",
  "Bro typed with confidence and zero evidence 💀",
  "Even Google wouldn't know what you were trying to say 😭🔎",
  "You really pressed send with no hesitation 💀📤",
  "Bro's keyboard deserves better treatment 😭⌨️",
  "That sentence took a wrong turn and never came back 💀",
  "Bro, please reboot your brain and try again 🔄🧠",
  "I've read better messages from a broken calculator 😭🧮",
  "Your message has NPC energy 💀🎮",
  "Bro is speedrunning embarrassment 😭🏃",
  "That was bold for someone this incorrect 💀",
  "You brought confidence to a battle against common sense 😭⚔️",
  "Bro's thoughts are still buffering 🌀💀",
  "That message needs subtitles 😭📺",
  "Even your typo is confused 💀",
  "Bro typed like the keyboard owed him money 😭⌨️",
  "Respectfully, what was that? 💀😂",
  "Your message just asked for a software update 🧠🔧",
  "Bro has unlimited confidence and limited accuracy 😭",
  "That take belongs in the recycle bin ♻️💀",
  "You didn't miss the point. You moved to another continent 😭🌍",
  "Bro really unlocked a new level of nonsense 💀🎮",
  "Your logic just disconnected from the server 📡😭",
  "That message aged badly before I even finished reading it 💀",
  "Bro, even the punctuation is disappointed 😭✍️",
  "You typed that like nobody would read it 💀👀",
  "Your brain said 'send it' and your common sense resigned 😭",
  "That was a premium-grade bad take 💀💳",
  "Bro is proof that confidence has no requirements 😂",
  "I've seen smarter arguments in YouTube comments 💀",
  "Your message needs a director's cut 😭🎬",
  "Bro's sentence went on a side quest 💀🗺️",
  "That explanation explained absolutely nothing 😭",
  "You really chose chaos with that message 💀🔥",
  "Bro, your keyboard is doing unpaid overtime 😭⌨️",
  "That was not the flex you thought it was 💀",
  "Your message has zero calories but somehow feels heavy 😭",
  "Bro's brain is running on demo mode 💀🧠",
  "Even silence would have been a better reply 😭🤐",
  "That message belongs in the blooper reel 💀🎬",
  "Bro is professionally unserious 😂",
  "Your argument just tripped over its own shoelaces 💀👟",
  "That was a lot of words for absolutely nothing 😭",
  "Bro brought vibes but forgot the facts 💀📚",
  "Your message has expired. Please try again 😭⏰",
  "Even the group chat needed a moment after reading that 💀",
  "Bro is creating problems nobody ordered 😂📦",
  "Your logic took the scenic route to nowhere 💀🛣️",
  "That message deserves a loading bar 😭⌛",
  "Bro really thought the audience was ready for that 💀🎤",
  "Your confidence is impressive. Your accuracy isn't 😭",
  "That was a certified 'why did I read this?' moment 💀",
  "Bro, please stop bullying the English language 😭📖",
  "Your sentence needs medical attention 💀🏥",
  "Even your emoji would disagree with you 😂",
  "Bro is typing faster than he's thinking 💀⚡",
  "That message came with no warranty 😭📦",
  "You just invented a new form of confusion 💀",
  "Bro's logic has left the chat 🚪😭",
  "That was ambitious for a message with no point 💀",
  "Your brain said 'trust me bro' and failed the mission 😭",
  "Bro, that's not a thought. That's a software bug 💀🐛",
  "I've seen random numbers make more sense 😭🔢",
  "Your message has side-character energy 💀🎭",
  "Bro really turned a simple thought into a boss fight 😭🎮",
  "That opinion needs a second opinion 💀🩺",
  "Your keyboard deserves an apology 😭⌨️",
  "Bro is arguing with reality at this point 💀🌎",
  "That was a legendary miss 🎯💀",
  "Your message just committed a crime against common sense 😭🚨",
  "Bro's thought process is on airplane mode ✈️💀",
  "That message has more plot holes than a bad movie 😭🎬",
  "You typed that with your whole chest and zero facts 💀",
  "Bro, even your autocorrect is throwing shade 😂📱",
  "That was a spectacularly unnecessary message 💀",
  "Your logic needs GPS 😭📍",
  "Bro is making the keyboard question its career 💀⌨️",
  "That message had potential. It chose violence instead 😭🔥",
  "You somehow made confusion sound confident 💀",
  "Bro, please return to the tutorial 😭🎮",
  "Your message just got rejected by common sense 💀🚫",
  "That's not a hot take. That's a house fire 🔥😭",
  "Bro's brain is running at 2 FPS 💀🧠",
  "Even the group chat's silence is roasting you 😭🤐",
  "You really sent that like it was a masterpiece 💀🎨",
  "Bro, your logic needs customer support 📞😭",
  "That message belongs in the 'what did I just read?' folder 💀📁",
  "You didn't cook. You microwaved confusion 😭🍽️",
  "Bro's confidence deserves an award. The message doesn't 💀🏆",
  "That was so random even the algorithm is confused 😭🤖",
  "Your thoughts need better internet 💀📡",
  "Bro just speedran getting roasted 😂🔥",
  "That message was louder than it was intelligent 💀🔊",
  "You brought chaos and forgot to bring a point 😭",
  "Bro, please let your brain finish loading 💀⌛",
];

/*
 * Admin IDs
 *
 * Supports:
 * global.config.ADMINBOT
 * global.config.ADMIN_IDS
 * global.config.adminBot
 *
 * Maaari ring string o array.
 */
function getAdminIDs() {
  const config = global.config || {};

  let admins =
    config.ADMINBOT ??
    config.ADMIN_IDS ??
    config.adminBot ??
    [];

  if (!Array.isArray(admins)) {
    admins = [admins];
  }

  return admins
    .map(id => String(id).trim())
    .filter(Boolean);
}

function isAdmin(senderID) {
  const admins = getAdminIDs();

  return admins.includes(String(senderID));
}

/*
 * Last reply tracking.
 * Prevents immediate duplicate roast in the same thread.
 */
const lastReplyByThread = new Map();

function getRandomRoast(threadID) {
  let reply;
  const lastReply = lastReplyByThread.get(threadID);

  do {
    reply =
      roastReplies[Math.floor(Math.random() * roastReplies.length)];
  } while (
    reply === lastReply &&
    roastReplies.length > 1
  );

  lastReplyByThread.set(threadID, reply);

  return reply;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID } = event;

  /*
   * ONLY dashboard-configured admins can use /bot
   */
  if (!isAdmin(senderID)) {
    return api.sendMessage(
      "🚫 Only the configured dashboard admin can use this command.",
      threadID,
      messageID
    );
  }

  const option = args[0]
    ? String(args[0]).toLowerCase()
    : null;

  if (option === "on") {
    sleepingThreads.add(threadID);
    saveThreads(sleepingThreads);

    return api.sendMessage(
      "🔥 Roast Bot is now ON.\n\nEvery message in this thread can trigger a random English roast. 💀",
      threadID,
      messageID
    );
  }

  if (option === "off") {
    sleepingThreads.delete(threadID);
    saveThreads(sleepingThreads);

    return api.sendMessage(
      "🌙 Roast Bot is now OFF in this thread.",
      threadID,
      messageID
    );
  }

  return api.sendMessage(
    "Usage:\n/bot on\n/bot off",
    threadID,
    messageID
  );
};

/*
 * Autoreply handler
 */
module.exports.handleEvent = function ({ api, event }) {
  const { threadID, senderID, body } = event;

  if (!sleepingThreads.has(threadID)) return;
  if (!body || !String(body).trim()) return;

  /*
   * Don't roast the bot itself
   */
  if (senderID === api.getCurrentUserID()) return;

  const roast = getRandomRoast(threadID);

  /*
   * Intentionally not awaited.
   * Multiple messages can be processed independently.
   */
  api.sendMessage(roast, threadID);
};
