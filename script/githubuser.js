const axios = require("axios");

module.exports.config = {
  name: "githubuser",
  version: "1.0.0",
  hasPermission: 0,
  credits: "zark",
  description: "Search a GitHub user using the Rapido API.",
  commandCategory: "tools",
  usages: "githubuser <username>",
  cooldowns: 5,
  role: 0,
  hasPrefix: true
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage(
      "❓ Please provide a GitHub username to search.\n\nUsage: githubuser <username>",
      threadID,
      messageID
    );
  }

  try {
    const res = await axios.get(`https://rapido.zetsu.xyz/api/github/user?query=${encodeURIComponent(query)}`);
    const { results } = res.data;

    if (!Array.isArray(results) || results.length === 0) {
      return api.sendMessage("❌ No GitHub user found with that username.", threadID, messageID);
    }

    const user = results[0];
    const info = `👤 𝗚𝗶𝘁𝗛𝘂𝗯 𝗨𝘀𝗲𝗿 𝗙𝗼𝘂𝗻𝗱:

• Username: ${user.username}
• Type: ${user.type}
• Profile: ${user.profile}`;

    const image = (await axios.get(user.avatar, { responseType: "stream" })).data;

    return api.sendMessage({ body: info, attachment: image }, threadID, messageID);
  } catch (err) {
    console.error("[githubuser.js] Error:", err.message || err);
    return api.sendMessage("🚫 Failed to fetch GitHub user data. Try again later.", threadID, messageID);
  }
};
