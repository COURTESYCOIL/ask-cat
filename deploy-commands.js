require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'progress',
        description: 'Check your progress in Ask Cat!',
    },
    {
        name: 'login',
        description: 'Get a link to log in with Discord and view your progress online.',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
