const axios = require('axios');

module.exports.config = {
  name: "advice",
  version: "1.0.0",
  role: 0,
  credits: "zark",
  description: "Get a random piece of advice using the Rapido API.",
  usage: "/advice",
  prefix: true,
  cooldowns: 3,
  commandCategory: "Fun"
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;

  try {
    // Send loading message first
    const waitMsg = `════『 𝗔𝗗𝗩𝗜𝗖𝗘 』════\n\n` +
      `💡 Fetching a random piece of advice...\nPlease wait a moment.`;
    await api.sendMessage(waitMsg, threadID, messageID);

    // Call the Rapido Advice API
    const apiUrl = "https://rapido.zetsu.xyz/api/advice";
    const response = await axios.get(apiUrl);

    let resultMsg = `════『 𝗔𝗗𝗩𝗜𝗖𝗘 』════\n\n`;

    if (response.data && typeof response.data === "object" && (response.data.advice || response.data.result)) {
      resultMsg += `💬 ${response.data.advice || response.data.result}`;
    } else if (typeof response.data === "string") {
      resultMsg += `💬 ${response.data}`;
    } else {
      resultMsg += "⚠️ Unable to fetch advice.";
    }

    resultMsg += `\n\n> Powered by Rapido Advice API`;

    return api.sendMessage(resultMsg, threadID, messageID);

  } catch (error) {
    console.error('❌ Error in advice command:', error.message || error);

    const errorMessage = `════『 𝗔𝗗𝗩𝗜𝗖𝗘 𝗘𝗥𝗥𝗢𝗥 』════\n\n` +
      `🚫 Failed to fetch advice.\nReason: ${error.response?.data?.message || error.message || 'Unknown error'}\n\n` +
      `> Please try again later.`;

    return api.sendMessage(errorMessage, threadID, messageID);
  }
};
