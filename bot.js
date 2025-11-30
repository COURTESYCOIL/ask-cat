require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'progress') {
        await interaction.reply('Click here to view your progress: https://ask-cat.vercel.app/');
    } else if (commandName === 'login') {
        await interaction.reply('Please visit our website to log in.');
    }
});

client.login(process.env.DISCORD_TOKEN);