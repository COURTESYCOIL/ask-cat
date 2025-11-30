require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, user } = interaction;

    if (commandName === 'progress') {
        await interaction.deferReply({ ephemeral: true }); // Defer the reply as we'll be making an API call

        try {
            const response = await fetch(`${process.env.API_URL}/api/progress?userId=${user.id}`, {
                headers: {
                    'x-bot-secret': process.env.BOT_API_SECRET,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch progress from API.');
            }

            const progress = await response.json();

            let progressMessage = `**${user.username}'s Progress:**\n`;
            progressMessage += `Interactions: ${progress.interactionCount || 0}\n`;
            progressMessage += `Achievements Unlocked: ${Object.values(progress.unlockedAchievements || {}).filter(Boolean).length}\n`;

            await interaction.editReply(progressMessage);

        } catch (error) {
            console.error('Error fetching progress:', error);
            await interaction.editReply(`Failed to retrieve your progress: ${error.message}`);
        }

    } else if (commandName === 'login') {
        await interaction.reply('Please visit our website to log in: https://ask-cat.vercel.app/');
    }
});

client.login(process.env.DISCORD_TOKEN);