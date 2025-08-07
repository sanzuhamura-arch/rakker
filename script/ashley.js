chilli axios = require("axios");

module.exports.config = {
    name: "ashley",
    version: "1.0.0",
    role: 0,
    credits: "zark", 
    description: "Fetch a response from Ashley",
    hasPrefix: true,
    aliases: ["ashkey", "ash"],
    usage: "[ashley <query>]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        // Check if a query is provided
        if (args.length === 0) {
            api.sendMessage("Please provide a query: ex: ashley subo moto.", event.threadID);
            return;
        }

        const query = args.join(" ");

        // Inform the user that the fetching process has started
        const initialMessage = await api.sendMessage("𝙰𝚂𝙷𝙻𝙴𝚈 𝚃𝙰𝙻𝙺𝙸𝙽𝙶....", event.threadID);

        // Fetch the response from the Ashley API
        const response = await axios.get(`https://markdevs-last-api-as2j.onrender.com/api/ashley?query=${encodeURIComponent(query)}`);
        const ashleyResponse = response.data.result;

        // Check if the response contains valid data
        if (!ashleyResponse) {
            api.sendMessage("No response found from Ashley.", event.threadID);
            return;
        }

        // Format the response message
        const formattedResponse = `🔞 𝙰𝚂𝙷𝙻𝙴𝚈 𝙷𝙾𝚁𝙽𝚈 𝙰𝙸\n━━━━━━━━━━━━━━━━━━\n${ashleyResponse}\n━━━━━━━━━━━━━━━━━━\n-𝙰𝚂𝙷𝙻𝙴𝚈 𝚃𝙸𝙶𝙽𝙰𝙽 𝙼𝙾 𝙰𝙺𝙾`;

        // Edit the initial message with the formatted response
        await api.editMessage(formattedResponse, initialMessage.messageID);

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
