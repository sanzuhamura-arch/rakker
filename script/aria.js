const axios = require('axios');

module.exports.config = {
  name: "aria",
  version: "9",
  role: 0,
  hasPrefix: false,
  credits: "Cliff", 
  description: "AI powered by Opera browser",
  aliases: ["Aria"],
  cooldowns: 0,
};

module.exports.run = async function ({api, event, args}) {
  const symbols = ["⎔", "☰"];
  const randomIndex = Math.floor(Math.random() * symbols.length);
  const tae = symbols[randomIndex];
  const query = encodeURIComponent(args.join(" "));

if (!query) {
          const messageInfo = await new Promise(resolve => {
            api.sendMessage('Please provide a question first!', event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
}

      const cliff = await new Promise(resolve => { api.sendMessage('🔍 Searching Please Wait....', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });

  const apiUrl = `https://yt-video-production.up.railway.app/Aria?q=${query}&userid=${event.senderID}`;

  try {
    const response = await axios.get(apiUrl);
    const ans = response.data.response;
    api.editMessage(ans, cliff.messageID);
  } catch (error) {
    api.sendMessage(error.message, event.threadID, event.messageID);
  }
};
