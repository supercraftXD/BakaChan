import { SlashCommandBuilder } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { replyUserError, ErrorTypes } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { getColor } from '../../config/bot.js';

// قائمة الصور المتحركة الخاصة بالحضن
const HUG_GIFS = [
    'https://media.giphy.com/media/13HOOW1mTNkEmk/giphy.gif',
    'https://media.giphy.com/media/od5H3lm65V14A/giphy.gif',
    'https://media.giphy.com/media/ZQN9jsRWp1M76/giphy.gif'
];

export default {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Give someone a warm hug!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to hug')
                .setRequired(true)),

    async execute(interaction) {
        // استخدام الطريقة الآمنة لتأجيل الرد المعتمدة في بوتك
        const deferSuccess = await InteractionHelper.safeDefer(interaction);
        if (!deferSuccess) {
            logger.warn(`Hug interaction defer failed`, {
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'hug'
            });
            return;
        }

        const targetUser = interaction.options.getUser('target');
        const user = interaction.user;

        // التحقق إن كان يحضن نفسه
        if (targetUser.id === user.id) {
            return replyUserError(interaction, {
                type: ErrorTypes.VALIDATION,
                message: 'You cannot hug yourself! Find someone nice to hug. 🤗',
            });
        }

        // اختيار صورة عشوائية
        const randomGif = HUG_GIFS[Math.floor(Math.random() * HUG_GIFS.length)];

        try {
            const embed = successEmbed(
                '🤗 Hug Time!',
                `**<@${user.id}>** gave a warm hug to **<@${targetUser.id}>**!`
            );
            
            embed.setImage(randomGif);
            embed.setColor(getColor('primary'));

            await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });

        } catch (error) {
            logger.error('Hug command execution error:', error);
            await replyUserError(interaction, {
                type: ErrorTypes.VALIDATION,
                message: 'An error occurred while executing this action.',
            });
        }
    },
};
