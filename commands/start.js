const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start ctrl-s"),
  async execute(interaction) {
    interaction.reply(
      `${interaction.user.username} a démarré ctrl-s.`
    );
  },
};
