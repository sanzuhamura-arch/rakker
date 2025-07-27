module.exports = {
  name: "admin",
  description: "Manage admin users. Usage: !admin add <username>",
  execute(message, args, bot) {
    if (args[0] === "add" && args[1]) {
      const usernameToAdd = args[1];

      if (!bot.admins.includes(message.author.username)) {
        message.reply("You do not have permission to add admins.");
        return;
      }
      
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
