import { SlashCommandBuilder } from 'discord.js';
import { createEmbed, successEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { replyUserError, ErrorTypes } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { getColor } from '../../config/bot.js';

// تعريف الحركات المتاحة مع الرسائل وصور الـ GIF الخاصة بها
const ROLEPLAY_ACTIONS = {
    hug: {
        name: 'Hug',
        description: 'Give someone a warm hug',
        messages: {
            withTarget: '{user} gave a warm hug to {target}! 🤗',
            self: '{user} gave themselves a warm hug... lonely? 🫂'
        },
        gifs: [
            'https://media.giphy.com/media/13HOOW1mTNkEmk/giphy.gif',
            'https://media.giphy.com/media/od5H3lm65V14A/giphy.gif',
            'https://media.giphy.com/media/ZQN9jsRWp1M76/giphy.gif'
        ]
    },
    kiss: {
        name: 'Kiss',
        description: 'Give someone a sweet kiss',
        messages: {
            withTarget: '{user} gave a sweet kiss to {target}! 💋',
            self: '{user} kissed themselves in the mirror. Narcissistic much? ✨'
        },
        gifs: [
            'https://media.giphy.com/media/GpyS1lJXJYupG/giphy.gif',
            'https://media.giphy.com/media/wHsWpD9K5Q55K/giphy.gif',
            'https://media.giphy.com/media5/26u4lOMA8JKSnLIOA/giphy.gif'
        ]
    },
    pat: {
        name: 'Pat',
        description: 'Pat someone on the head',
        messages: {
            withTarget: '{user} gently patted {target} on the head! 🐾',
            self: '{user} patted themselves on the head. Good job! 🖐️'
        },
        gifs: [
            'https://media.giphy.com/media/109ltuoSQT212w/giphy.gif',
            'https://media.giphy.com/media/5tmRHwTlHAA9WkVxTU/giphy.gif'
        ]
    },
    slap: {
        name: 'Slap',
        description: 'Slap someone across the face',
        messages: {
            withTarget: '{user} slapped {target} right across the face! Ouch! 🖐️💥',
            self: '{user} slapped themselves... Why would you do that? 🤕'
        },
        gifs: [
            'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif',
            'https://media.giphy.com/media/3oKIPnmiqNhZIleLPW/giphy.gif'
        ]
    }
};

// تجهيز خيارات الـ Slash Command بناءً على الحركات المعرفة
const ACTION_CHOICES = Object.entries(ROLEPLAY_ACTIONS).map(([key, data]) => ({
    name: data.name,
    value: key
}));

export default {
    data: new SlashCommandBuilder()
        .setName('roleplay')
        .setDescription('Perform a roleplay action with someone')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('The action you want to perform')
                .setRequired(true)
                .addChoices(...ACTION_CHOICES))
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to interact with')
                .setRequired(false)),

    async execute(interaction) {
        const deferSuccess = await InteractionHelper.safeDefer(interaction);
        if (!deferSuccess) {
            logger.warn(`Roleplay interaction defer failed`, {
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'roleplay'
            });
            return;
        }

        const actionKey = interaction.options.getString('action');
        const targetUser = interaction.options.getUser('target');
        const actionData = ROLEPLAY_ACTIONS[actionKey];

        if (!actionData) {
            return replyUserError(interaction, {
                type: ErrorTypes.VALIDATION,
                message: 'Invalid roleplay action selected.',
            });
        }

        const user = interaction.user;
        let description = '';

        // التحقق مما إذا كان الشخص يوجه الحركة لنفسه أو لشخص آخر
        if (!targetUser || targetUser.id === user.id) {
            description = actionData.messages.self
                .replace('{user}', `<@${user.id}>`);
        } else {
            description = actionData.messages.withTarget
                .replace('{user}', `<@${user.id}>`)
                .replace('{target}', `<@${targetUser.id}>`);
        }

        // اختيار صورة عشوائية من القائمة المحددة للحركة
        const randomGif = actionData.gifs[Math.floor(Math.random() * actionData.gifs.length)];

        try {
            const embed = successEmbed(
                `✨ Roleplay: ${actionData.name}`,
                description
            );
            
            embed.setImage(randomGif);
            embed.setColor(getColor('primary'));

            await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });

        } catch (error) {
            logger.error(`Roleplay command error for action ${actionKey}:`, error);
            await replyUserError(interaction, {
                type: ErrorTypes.VALIDATION,
                message: 'An error occurred while executing this roleplay action.',
            });
        }
    },
};
