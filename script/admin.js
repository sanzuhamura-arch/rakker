// admin.js - Improved "admin" command for AutoBot
// Supports !admin add <username>, !admin remove <username>, !admin list

module.exports = {
  name: "admin",
  role: 2,
  description: "Manage admin users. Usage: !admin add <username>, !admin remove <username>, !admin list",
  execute(message, args, bot) {
    // Ensure the bot has the admins array
    if (!bot.admins) bot.admins = [];

    // Only allow existing admins to use admin management commands
    if (!bot.admins.includes(message.author.username)) {
      message.reply("You do not have permission to manage admins.");
      return;
    }

    // !admin add <username>
    if (args[0] === "add" && args[1]) {
      const usernameToAdd = args[1];
      if (bot.admins.includes(usernameToAdd)) {
        message.reply(`User "${usernameToAdd}" is already an admin.`);
      } else {
        bot.admins.push(usernameToAdd);
        message.reply(`User "${usernameToAdd}" has been added as an admin.`);
      }
      return;
    }

    // !admin remove <username>
    if (args[0] === "remove" && args[1]) {
      const usernameToRemove = args[1];
      if (bot.admins.includes(usernameToRemove)) {
        bot.admins = bot.admins.filter(u => u !== usernameToRemove);
        message.reply(`User "${usernameToRemove}" has been removed from admins.`);
      } else {
        message.reply(`User "${usernameToRemove}" is not an admin.`);
      }
      return;
    }

    // !admin list
    if (args[0] === "list") {
      if (bot.admins.length === 0) {
        message.reply("No admins have been set.");
      } else {
        message.reply(`Current admins: ${bot.admins.join(", ")}`);
      }
      return;
    }

    // Invalid command usage
    message.reply("Invalid usage. Try: !admin add <username>, !admin remove <username>, !admin list");
  },
};
