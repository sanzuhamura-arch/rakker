const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "music",
  version: "2.0.6",
  role: 0,
  hasPermission: 0,
  description: "Play a song from YouTube",
  commandCategory: "utility",
  usage: "[title]",
  usePrefix: false,
  hasPrefix: false,
  aliases: ["sing"],
  cooldown: 0
};

module.exports.run = async ({ api, event, args }) => {
  const search = args.join(" ");

  try {
    if (!search) {
      const messageInfo = await new Promise(resolve => {
        api.sendMessage('𝙿𝙻𝙴𝙰𝚂𝙴 𝙿𝚁𝙾𝚅𝙸𝙳𝙴 𝙰 𝚂𝙾𝙽𝙶 𝚃𝙸𝚃𝙻𝙴', event.threadID, (err, info) => {
          resolve(info);
        });
      });

      setTimeout(() => {
        api.unsendMessage(messageInfo.messageID);
      }, 10000);

      return;
    }

    const findingMessage = await api.sendMessage(`𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 𝙵𝙾𝚁 "${search}"`, event.threadID);

        const videoSearchUrl = `https://betadash-search-download.vercel.app/yt?search=${search}`;

        const videoResponse = await axios.get(videoSearchUrl);
        const videoData = videoResponse.data[0];

        if (!videoData) {
            return res.status(404).json({ error: 'Video not found' });
        }

const videoUrl = videoData.url;

    const youtubeTrackUrl = `https://betadash-api-swordslush.vercel.app/ytdlv4?url=${videoUrl}&format=mp3`;
    const trackResponse = await axios.get(youtubeTrackUrl);

    const { downloadUrl: audio, title } = trackResponse.data;

    const cacheDir = path.join(__dirname, 'cache');
    const fileName = `music.mp3`;
    const filePath = path.join(cacheDir, fileName);

    fs.ensureDirSync(cacheDir);

    const audioStream = await axios.get(audio, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, Buffer.from(audioStream.data));

    api.sendMessage({
      body: `💽 Now playing: ${title}`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    api.unsendMessage(findingMessage.messageID);
  } catch (error) {
    const errorMessage = await new Promise(resolve => {
      api.sendMessage('[ERROR] ' + error, event.threadID, (err, info) => {
        resolve(info);
      });
    });

    setTimeout(() => {
      api.unsendMessage(errorMessage.messageID);
    }, 10000);

    return;
  }
};
