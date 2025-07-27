// admin.js - Example "admin add" command for AutoBot

module.exports = {
  name: "admin",
  role: 2,
  description: "Manage admin users. Usage: !admin add <username>",
  execute(message, args, bot) {
    // Check if the command is "!admin add" and has a username argument
    if (args[0] === "add" && args[1]) {
      const usernameToAdd = args[1];

      // Check if the user running the command is already an admin
      if (!bot.admins.includes(message.author.username)) {
        message.reply("You do not have permission to add admins.");
        return;
      }

      // Add the new admin if not already present
      if (!bot.admins.includes(usernameToAdd)) {
        bot.admins.push(usernameToAdd);
        message.reply(`User "${usernameToAdd}" has been added as an admin.`);
      } else {
        message.reply(`User "${usernameToAdd}" is already an admin.`);
      }
    } else {
      message.reply("Invalid usage. Try: !admin add <username>");
    }
  },
};
