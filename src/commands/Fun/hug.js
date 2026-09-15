import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

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
                .setRequired(true)), // جعلناه مطلوباً لضمان وجود شخص يتم التفاعل معه

    async execute(interaction) {
        // تأجيل الرد فوراً لمنع انتهاء مهلة التفاعل
        await interaction.deferReply();

        const targetUser = interaction.options.getUser('target');
        const user = interaction.user;

        // التحقق إن كان يحضن نفسه
        if (targetUser.id === user.id) {
            return await interaction.editReply({
                content: `<@${user.id}> tried to hug themselves... lonely? 🫂`
            });
        }

        // اختيار صورة عشوائية
        const randomGif = HUG_GIFS[Math.floor(Math.random() * HUG_GIFS.length)];

        // بناء الـ Embed مباشرة
        const embed = new EmbedBuilder()
            .setColor('#ffb6c1')
            .setDescription(`🤗 **<@${user.id}>** gave a warm hug to **<@${targetUser.id}>**!`)
            .setImage(randomGif)
            .setTimestamp();

        // إرسال النتيجة
        await interaction.editReply({ embeds: [embed] });
    },
};
