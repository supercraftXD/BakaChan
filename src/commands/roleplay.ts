import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

// قائمة بالصور التفاعلية لكل أمر
const roleplayActions: Record<string, { action: string; gifs: string[] }> = {
    hug: {
        action: 'قام بعناق',
        gifs: [
            'https://media.giphy.com/media/26vUBWsGxrX9R42r6/giphy.gif',
            'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif'
        ]
    },
    slap: {
        action: 'قام بصفع',
        gifs: [
            'https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif',
            'https://media.giphy.com/media/3oKZHMlvvxWMROrjsA/giphy.gif'
        ]
    },
    pat: {
        action: 'قام التربيت على راس',
        gifs: [
            'https://media.giphy.com/media/109ltuoSQT212w/giphy.gif',
            'https://media.giphy.com/media/osYdf0pPjIN4Y/giphy.gif'
        ]
    }
};

export const data = new SlashCommandBuilder()
    .setName('rp')
    .setDescription('أوامر تقمص الأدوار والتفاعل بين الأعضاء')
    .addSubcommand(subcommand =>
        subcommand
            .setName('hug')
            .setDescription('اعنق عضواً معيناً')
            .addUserOption(option =>
                option.setName('user').setDescription('العضو المراد عناقه').setRequired(true)
            ))
    .addSubcommand(subcommand =>
        subcommand
            .setName('slap')
            .setDescription('اصفع عضواً معيناً')
            .addUserOption(option =>
                option.setName('user').setDescription('العضو المراد صفعه').setRequired(true)
            ))
    .addSubcommand(subcommand =>
        subcommand
            .setName('pat')
            .setDescription('رتب على رأس عضواً معيناً')
            .addUserOption(option =>
                option.setName('user').setDescription('العضو المراد التربيت على راسه').setRequired(true)
            ));

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser('user', true);
    const author = interaction.user;

    // منع العضو من تفاعل مع نفسه (اختياري)
    if (targetUser.id === author.id) {
        return interaction.reply({
            content: 'لا يمكنك تنفيذ هذا الأمر على نفسك!',
            ephemeral: true
        });
    }

    const actionData = roleplayActions[subcommand];
    if (!actionData) {
        return interaction.reply({ content: 'هذا الأمر غير متوفر حالياً.', ephemeral: true });
    }

    // اختيار صورة عشوائية من القائمة
    const randomGif = actionData.gifs[Math.floor(Math.random() * actionData.gifs.length)];

    const embed = new EmbedBuilder()
        .setColor('#ffb6c1')
        .setDescription(`**${author.username}** ${actionData.action} **${targetUser.username}**! ❤️`)
        .setImage(randomGif)
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
