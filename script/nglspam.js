const axios = require('axios');

module.exports.config = {
  name: "nglspam",
  version: "1.0.0",
  role: 2,
  credits: "zark",
  description: "Spam NGL inbox with a message using the Ace API.",
  usage: "/nglspam <username> | <amount> | <message>",
  prefix: true,
  cooldowns: 10,
  commandCategory: "Fun"
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prefix = "/"; // Change if your bot uses a dynamic prefix

  // Join args and split by '|'
  const input = args.join(' ').split('|').map(s => s.trim());
  const [username, amount, message] = input;

  if (!username || !amount || !message) {
    const usageMessage = `════『 𝗡𝗚𝗟 𝗦𝗣𝗔𝗠 』════\n\n` +
      `⚠️ Please provide all required parameters.\n\n` +
      `📌 Usage: ${prefix}nglspam <username> | <amount> | <message>\n` +
      `💬 Example: ${prefix}nglspam zark | 5 | Hello from my bot!\n\n` +
      `> credits burat!`;

    return api.sendMessage(usageMessage, threadID, messageID);
  }

  try {
    // Send loading message first
    const waitMsg = `════『 𝗡𝗚𝗟 𝗦𝗣𝗔𝗠 』════\n\n` +
      `🚀 Sending ${amount} NGL messages to @${username}...\n\nMessage:\n${message}\n\nPlease wait a moment.`;
    await api.sendMessage(waitMsg, threadID, messageID);

    // Build API URL
    const apiUrl = `https://ace-rest-api.onrender.com/api/nglspam?username=${encodeURIComponent(username)}&amount=${encodeURIComponent(amount)}&message=${encodeURIComponent(message)}`;
    
    // Call API
    const response = await axios.get(apiUrl);

    // Check for result or message in response
    const data = response.data?.result || response.data?.message || response.data;
    let doneMsg = `════『 𝗡𝗚𝗟 𝗦𝗣𝗔𝗠 』════\n\n`;

    if (data && typeof data === "string") {
      doneMsg += data;
    } else {
      doneMsg += `✅ Successfully sent ${amount} messages to @${username}!\n\n> Thanks for using zark autobot-site`;
    }

    return api.sendMessage(doneMsg, threadID, messageID);

  } catch (error) {
    console.error('❌ Error in nglspam command:', error.message || error);

    const errorMessage = `════『 𝗡𝗚𝗟 𝗦𝗣𝗔𝗠 𝗘𝗥𝗥𝗢𝗥 』════\n\n` +
      `🚫 Failed to spam NGL inbox.\nReason: ${error.response?.data?.message || error.message || 'Unknown error'}\n\n` +
      `> Please try again later.`;

    return api.sendMessage(errorMessage, threadID, messageID);
  }
};
