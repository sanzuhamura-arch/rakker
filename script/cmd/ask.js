const axios = require('axios');

module.exports.config = {
  name: "goody",
  version: "9",
  role: 0,
  hasPrefix: false,
  description: "AI assistant",
  aliases: ["Goody"],
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

  const apiUrl = `https://betadash-api-swordslush.vercel.app/goody?ask=${query}`;

  try {
    const response = await axios.get(apiUrl);
    const ans = response.data.response;
    api.editMessage(ans, cliff.messageID);
  } catch (error) {
    api.sendMessage("API DOWN", event.threadID, event.messageID);
  }
};
