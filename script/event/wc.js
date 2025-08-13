const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "welcome",
    version: "1.4.0",
    credits: "zark",
    description: "Sends a welcome message with image using Kaiz API",
    usages: "Auto on member join",
    cooldown: 5,
};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.logMessageType === "log:subscribe") {
        try {
            const addedParticipants = event.logMessageData.addedParticipants;
            const senderID = addedParticipants[0].userFbId;
            let userInfo = await api.getUserInfo(senderID);
            let name = userInfo[senderID].name;

            // ✅ Updated avatar using Kaiz API
            const avatarUrl = `https://kaiz-apis.gleeze.com/api/facebookpfp?uid=${senderID}&apikey=12417c89-ac72-4c8e-a174-9ee378771b24`;

            const gender = userInfo[senderID]?.gender;
            const prefix = gender === 2 ? "Mr." : gender === 1 ? "Miss" : "";

            const maxLength = 15;
            if (name.length > maxLength) {
                name = name.substring(0, maxLength - 3) + '...';
            }

            const groupInfo = await api.getThreadInfo(event.threadID);
            const groupName = groupInfo.threadName || "this group";
            const memberCount = groupInfo.participantIDs.length;
            const background = groupInfo.imageSrc || "https://i.ibb.co/4YBNyvP/images-76.jpg";

            // Kaiz Welcome Image API
            const apiUrl = `https://kaiz-apis.gleeze.com/api/welcome?username=${encodeURIComponent(name)}&avatarUrl=${encodeURIComponent(avatarUrl)}&groupname=${encodeURIComponent(groupName)}&bg=${encodeURIComponent(background)}&memberCount=${memberCount}&apikey=25644cdb-f51e-43f1-894a-ec718918e649`;

            const { data } = await axios.get(apiUrl, { responseType: 'arraybuffer' });
            const filePath = './cache/welcome.jpg';
            if (!fs.existsSync('./cache')) fs.mkdirSync('./cache');
            fs.writeFileSync(filePath, Buffer.from(data));

            const welcomeMessage = `
🌟 𝙒𝙀𝙇𝘾𝙊𝙈𝙀 𝘼𝘽𝙊𝘼𝙍𝘿 🌟

👤 Name: ${prefix} ${name}
👥 Group: ${groupName}
🔢 Member #: ${memberCount}

💬 We're thrilled to have you with us!
🤝 Please feel free to interact, share, and enjoy your stay.

━━━━━━━━━━━━━━━━━━━━━━━
👑 Admin Zark Dev ❤️ 
💖 Sending you warm vibes! Ummmma~ 😘
━━━━━━━━━━━━━━━━━━━━━━━`;

            await api.sendMessage({
                body: welcomeMessage,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));

        } catch (error) {
            console.error("Welcome handler error:", error);

            const fallbackMessage = `
🌟 𝙒𝙀𝙇𝘾𝙊𝙈𝙀 🌟

Sorry, we couldn’t load the welcome image.

But we’re so happy to have you here!
Enjoy your stay. 💖`;

            await api.sendMessage({ body: fallbackMessage }, event.threadID);
        }
    }
};
