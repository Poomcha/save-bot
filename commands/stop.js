const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop ctrl-s"),
  async execute(interaction) {
    interaction.reply(
      `${interaction.user.username} a stoppé ctrl-s.`
    );
  },
};