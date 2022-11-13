const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start ctrl-s.')
    .addStringOption((option) =>
      option
        .setName('interval')
        .setDescription('Interval between each reminder.')
        .setRequired(true)
        .addChoices(
          { name: 'spam (1s)', value: '1_s' },
          { name: 'frequent (5mn)', value: '5_mn' },
          { name: 'often (15mn)', value: '15_mn' },
          { name: 'classic (30mn)', value: '30_mn' },
          { name: 'hourly (1h)', value: '60_mn' },
          { name: 'daily (?)', value: `${60 * 24}_mn` }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName('random')
        .setDescription(
          "Choose to mention a random channel's user or everyone."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    interaction.reply(
      `🤖 ${
        interaction.user.username
      } started ctrl-s. ⏲️ Interval: ${interaction?.options
        .getString('interval')
        .split('_')
        .join('')}. 🫵 Mention: ${
        interaction?.options.getBoolean('random') ? '@random' : '@everyone'
      }.`
    );
  },
};
