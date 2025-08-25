const axios = require("axios");

module.exports.config = {
  name: "gemini",
  version: "1.0.0",
  role: 0,
  credits: "zark",
  description: "Ask the Gemini AI a question and get a thoughtful answer.",
  commandCategory: "ai",
  usages: "gemini [question]",
  cooldowns: 5,
  hasPrefix: true
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage(
      "❓ Please provide a question to ask Gemini.\n\nUsage: gemini What is love?",
      threadID,
      () => {},
      messageID
    );
  }

  try {
    // Fetch from the Gemini API
    const res = await axios.get("https://ace-rest-api.onrender.com/api/gemini/text", {
      params: { prompt }
    });

    const answer = res.data?.response || res.data?.answer || res.data?.text;
    if (!answer) {
      return api.sendMessage(
        "⚠️ No response received from Gemini. Try again later.",
        threadID,
        () => {},
        messageID
      );
    }

    // Trim if too long
    const maxLen = 2000;
    const output = answer.length > maxLen ? answer.slice(0, maxLen) + "..." : answer;

    return api.sendMessage(
      `🤖 𝗚𝗲𝗺𝗶𝗻𝗶 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲:\n\n${output}`,
      threadID,
      () => {},
      messageID
    );
  } catch (err) {
    console.error("[gemini.js] API Error:", err.response?.data || err.message);
    return api.sendMessage(
      "🚫 Failed to reach Gemini API. Please try again later.",
      threadID,
      () => {},
      messageID
    );
  }Vernn
