const axios = require('axios');

module.exports.config = {
    name: "aria",
    version: 1.0,
    description: "AI",
    hasPrefix: false,
    usages: "{pn} [prompt]",
    aliases: ["Aria"],
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const prompt = args.join(" ");
        if (!prompt) {
        const messageInfo = await new Promise(resolve => {
            api.sendMessage("Hey I'm your virtual assistant, ask me a question.", event.threadID, (err, info) => {
                resolve(info);
            });
        });

        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);

        return;
    }

        const response = await axios.get(`https://betadash-api-swordslush-production.up.railway.app/Aria?ask=${encodeURIComponent(prompt)}&userid=${event.senderID}`);
        const answer = response.data.response;

        await api.sendMessage(answer, event.threadID);
    } catch (error) {
    }
};
