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
    },
    {
        name: 'ban',
        description: 'Bans a user from the server.',
        options: [
            {
                name: 'user',
                type: 6, // USER type
                description: 'The user to ban.',
                required: true,
            },
            {
                name: 'reason',
                type: 3, // STRING type
                description: 'The reason for the ban.',
                required: false,
            },
        ],
    },
    {
        name: 'kick',
        description: 'Kicks a user from the server.',
        options: [
            {
                name: 'user',
                type: 6, // USER type
                description: 'The user to kick.',
                required: true,
            },
            {
                name: 'reason',
                type: 3, // STRING type
                description: 'The reason for the kick.',
                required: false,
            },
        ],
    },
    {
        name: 'timeout',
        description: 'Times out a user for a specified duration.',
        options: [
            {
                name: 'user',
                type: 6, // USER type
                description: 'The user to timeout.',
                required: true,
            },
            {
                name: 'duration',
                type: 4, // INTEGER type
                description: 'The duration of the timeout in seconds.',
                required: true,
                choices: [
                    { name: '60 seconds', value: 60 },
                    { name: '5 minutes', value: 300 },
                    { name: '10 minutes', value: 600 },
                    { name: '1 hour', value: 3600 },
                    { name: '1 day', value: 86400 },
                    { name: '1 week', value: 604800 },
                ],
            },
            {
                name: 'reason',
                type: 3, // STRING type
                description: 'The reason for the timeout.',
                required: false,
            },
        ],
    },
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
