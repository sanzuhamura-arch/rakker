const axios = require('axios');

module.exports.config = {
    name: "ask",
    version: 1.0,
    description: "AI",
    hasPrefix: false,
    usages: "{pn} [prompt]",
    aliases: [],
    cooldown: 0,
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

        const response = await axios.get(`https://hiro-ai.vercel.app/ai?ask=${encodeURIComponent(prompt)}`);
        const answer = response.data.response;

        await api.sendMessage(answer, event.threadID);
    } catch (error) {
        console.error("Error");
    }
};
