require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'progress') {
        const userId = interaction.user.id;
        try {
            const response = await fetch(`${process.env.API_URL}/api/progress/${userId}`);
            if (response.ok) {
                const progress = await response.json();
                const achievements = Object.keys(progress.unlockedAchievements).filter(key => progress.unlockedAchievements[key]).join(', ') || 'None';
                await interaction.reply(`Your progress:\nInteraction Count: ${progress.interactionCount}\nAchievements: ${achievements}`);
            } else {
                await interaction.reply('Could not find your progress. Have you played Ask Cat before?');
            }
        } catch (error) {
            console.error('Failed to fetch progress:', error);
            await interaction.reply('Sorry, something went wrong while fetching your progress.');
        }
    } else if (commandName === 'login') {
        // Construct the login URL using the base API URL
        const loginUrl = 'https://ask-cat.vercel.app/';
        await interaction.reply({ 
            content: `Click here to log in and view your progress on the web: ${loginUrl}`,
            ephemeral: true // Only the user who ran the command can see this message
        });
    }
});

client.login(process.env.DISCORD_TOKEN);
