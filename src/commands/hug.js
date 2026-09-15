import { SlashCommandBuilder } from 'discord.js';
import { successEmbed, warningEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// Free, keyless anime-gif API used for the /hug reaction image.
const HUG_GIF_ENDPOINT = 'https://nekos.best/api/v2/hug';
const FETCH_TIMEOUT_MS = 5000;

async function fetchHugGif() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(HUG_GIF_ENDPOINT, { signal: controller.signal });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const result = data?.results?.[0];
    return result?.url ?? null;
  } catch (error) {
    logger.warn(`Failed to fetch hug gif: ${error.message}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export default {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Give someone a warm hug.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to hug.')
        .setRequired(true),
    ),
  category: 'Fun',

  async execute(interaction, config, client) {
    await InteractionHelper.safeDefer(interaction);

    const sender = interaction.user;
    const target = interaction.options.getUser('user');

    if (target.id === sender.id) {
      const embed = warningEmbed(
        '🤗 Self Hug',
        `**${sender.username}** wraps their arms around themselves. A little lonely, but still cute!`,
      );
      return await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    }

    if (target.bot) {
      const embed = warningEmbed(
        '🤗 Invalid Target',
        'You can\'t hug a bot! Try hugging a real person instead.',
      );
      return await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    }

    const gifUrl = await fetchHugGif();

    const embed = successEmbed(
      '🤗 Hug!',
      `**${sender.username}** gives **${target.username}** a big warm hug!`,
    );

    if (gifUrl) {
      embed.setImage(gifUrl);
    }

    await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
    logger.debug(`Hug command executed: ${sender.id} hugged ${target.id} in guild ${interaction.guildId}`);
  },
};
