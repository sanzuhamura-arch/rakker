const ugh = require("axios");

const sh = {};

sh["config"] = {
  name: "shoti",
  version: "9",
  description: "Generate random shoti 😝",
  commandCategory: "media",
  hasPermssion: 0,
  cooldowns: 9,
  usages: "[shot]",
  role: 0,
  hasPrefix: false,
};

sh["run"] = async function ({ api: a, event: e }) {
  try {   
    const l = await a.sendMessage(`Sending shoti, please wait...`, e.threadID);

    const k = await ugh.get('https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu');
    const t = k.data.title;
    const u = k.data.username;
    const n = k.data.nickname;
    const s = k.data.shotiurl;

    const v = await ugh.get(s, { responseType: "stream" });

    a.unsendMessage(l.messageID);

    await a.sendMessage({
      body: `Username: ${u}`,
      attachment: v.data
    }, e.threadID, e.messageID);
  } catch (error) {
    a.sendMessage(`𝙴𝚁𝚁𝙾𝚁: 𝙽𝚘 𝚜𝚑𝚊𝚠𝚝𝚢 𝚟𝚒𝚍𝚎𝚘 𝚏𝚘𝚞𝚗𝚍.`, e.threadID, e.messageID);
  }
};

module.exports = sh;
