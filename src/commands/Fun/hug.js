import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
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
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('target');
        const user = interaction.user;

        if (targetUser.id === user.id) {
            return await interaction.editReply({
                content: '❌ You cannot hug yourself! Find someone nice to hug. 🤗'
            });
        }

        const randomGif = HUG_GIFS[Math.floor(Math.random() * HUG_GIFS.length)];

        try {
            const embed = new EmbedBuilder()
                .setTitle('🤗 Hug Time!')
                .setDescription(`**<@${user.id}>** gave a warm hug to **<@${targetUser.id}>**!`)
                .setImage(randomGif)
                .setColor(getColor('primary'))
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Hug command error:', error);
            await interaction.editReply({
                content: '❌ An error occurred while executing this action.'
            });
        }
    },
};
