const axios = require('axios');

module.exports.config = {
  name: "ai",
  version: "9",
  role: 0,
  hasPrefix: false,
  description: "AI powered by blackbox",
  aliases: ["Ai"],
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

  const apiUrl = `https://yt-video-production.up.railway.app/gpt4-omni?ask=${query}&userid=${event.senderID}`;

  try {
    const response = await axios.get(apiUrl);
    const ans = response.data.response;
    const cleanResponseData = ans.replace(/\n\nIs this answer helpful to you\? Kindly click the link below\nhttps:\/\/click2donate.kenliejugarap.com\n\(Clicking the link and clicking any ads or button and wait for 30 seconds \(3 times\) everyday is a big donation and help to us to maintain the servers, last longer, and upgrade servers in the future\)/, '');
    api.editMessage(ans, cliff.messageID);
  } catch (error) {
    console.error();
    api.sendMessage("API SUCKS", event.threadID, event.messageID);
  }
};
