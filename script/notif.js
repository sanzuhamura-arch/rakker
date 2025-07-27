const fs = require("fs");

module.exports = {
    name: "notify",
    usePrefix: false,
    usage: "notify <message to announce>",
    version: "1.0",
    cooldown: 5,
    role: 2, // Changed to false to make it public

    execute: async ({ api, event, args }) => {
        // Remove admin check
        const message = args.join(" ");
        if (!message) {
            return api.sendMessage("⚠️ Please provide a message to announce.", event.threadID);
        }

        const allThreads = await api.getThreadList(100, null, ["INBOX"]);
        const groupThreads = allThreads.filter(t => t.isGroup && !t.isArchived);

        let sentCount = 0;
        for (const thread of groupThreads) {
            try {
                await api.sendMessage(`📢 Announcement:\n\n${message}`, thread.threadID);
                sentCount++;
            } catch (err) {
                console.error(`❌ Failed to send to ${thread.threadID}:`, err.message);
            }
        }

        return api.sendMessage(`✅ Announcement sent to ${sentCount} group(s).`, event.threadID);
    }
};
