require('dotenv').config();
const fs = require('fs').promises;
const { catResponses, defaultCatResponses } = require('./bot_responses');
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const botProgressFilePath = './bot_progress.json';

async function loadBotProgress() {
    try {
        const data = await fs.readFile(botProgressFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('bot_progress.json not found, creating a new one.');
            return {}; // Return empty object if file doesn't exist
        }
        console.error('Error loading bot progress:', error);
        return {};
    }
}

async function saveBotProgress(progress) {
    try {
        await fs.writeFile(botProgressFilePath, JSON.stringify(progress, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving bot progress:', error);
    }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

const achievements = {
    'first_words': {
        name: 'First Words',
        description: 'You\'ve had your first interaction with the Cat Bot!',
        icon: '⭐',
    },
    '100_achievements': {
        name: '100 Achievements',
        description: 'You\'ve interacted with the Cat Bot 100 times!',
        icon: '🏆',
    },
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = '.'; // Define your prefix here

client.on('messageCreate', async message => {
    console.log(`Received message: ${message.content}`);
    if (message.author.bot) return;
    console.log(`Message is not from a bot: ${message.content}`);
    if (!message.content.startsWith(prefix)) return;
    console.log(`Message starts with prefix: ${message.content}`);

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    console.log(`Parsed command: ${command}, Arguments: ${args}`);

    if (command === 'ban') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('You do not have permission to ban members.');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('You need to mention a user to ban!');
        }

        const member = message.guild.members.cache.get(target.id);
        if (!member) {
            return message.reply('That user is not in this guild.');
        }

        let banDuration = 0; // Default to permanent ban
        const durationArg = args[0];
        if (durationArg) {
            const durationInMinutes = parseInt(durationArg);
            if (!isNaN(durationInMinutes) && durationInMinutes > 0) {
                banDuration = durationInMinutes * 60 * 1000; // Convert minutes to milliseconds
            } else {
                return message.reply('Please provide a valid duration in minutes (e.g., `.ban @user 60`).');
            }
        }

        try {
            await member.ban({ 
                deleteMessageSeconds: 60 * 60 * 24 * 7, // Delete messages from the last 7 days
                reason: `Banned by ${message.author.tag}` + (banDuration > 0 ? ` for ${banDuration / (60 * 1000)} minutes` : '')
            });
            message.reply(`${target.tag} has been banned` + (banDuration > 0 ? ` for ${banDuration / (60 * 1000)} minutes.` : '.'));

            if (banDuration > 0) {
                setTimeout(async () => {
                    // Discord.js v14 does not have an unban method on GuildMember
                    // You would typically need to fetch the ban and then remove it
                    // This is a placeholder for unban logic, which is more complex
                    // and might require storing ban IDs or using a different approach.
                    console.log(`Attempting to unban ${target.tag} after ${banDuration / (60 * 1000)} minutes.`);
                    // Example of how you might unban (requires GuildBanManager)
                    // await message.guild.bans.remove(target.id, 'Temporary ban expired');
                }, banDuration);
            }

        } catch (error) {
            console.error('Error banning member:', error);
            message.reply('I was unable to ban that member. Make sure my role is high enough.');
        }
    } else if (command === 'mute') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('You do not have permission to mute members.');
        }

        const target = message.mentions.users.first();
        if (!target) {
            return message.reply('You need to mention a user to mute!');
        }

        const member = message.guild.members.cache.get(target.id);
        if (!member) {
            return message.reply('That user is not in this guild.');
        }

        let muteDuration = 0; // Default to no timeout
        const durationArg = args[0];
        if (durationArg) {
            const durationInMinutes = parseInt(durationArg);
            if (!isNaN(durationInMinutes) && durationInMinutes > 0) {
                muteDuration = durationInMinutes * 60 * 1000; // Convert minutes to milliseconds
            } else {
                return message.reply('Please provide a valid duration in minutes (e.g., `.mute @user 60`).');
            }
        }

        try {
            if (muteDuration > 0) {
                await member.timeout(muteDuration, `Muted by ${message.author.tag} for ${muteDuration / (60 * 1000)} minutes`);
                message.reply(`${target.tag} has been muted for ${muteDuration / (60 * 1000)} minutes.`);
            } else {
                return message.reply('Please provide a duration to mute the user.');
            }
        } catch (error) {
            console.error('Error muting member:', error);
            message.reply('I was unable to mute that member. Make sure my role is high enough.');
        }
    } else if (command === 'status') {
        const statusEmbed = {
            color: 0x0099ff,
            title: 'Cat Bot Status',
            description: 'Meow! I am currently online and ready to assist.',
            fields: [
                {
                    name: 'Functionality',
                    value: 'I respond to various commands and interactions. Try asking me something!',
                },
                {
                    name: 'Progress Updates',
                    value: 'The `/progress` command is currently under development. Stay tuned for updates!',
                },
                {
                    name: 'Upcoming Features',
                    value: 'More exciting features, including advanced achievement tracking and personalized interactions, are coming soon!',
                },
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Powered by Catnip',
            },
        };

        message.reply({ embeds: [statusEmbed] });
    } else if (command === 'ask') {
        const userId = message.author.id;
        const userTag = message.author.tag;
        let userProgress = await loadBotProgress();

        if (!userProgress[userId]) {
            userProgress[userId] = {
                interactionCount: 0,
                achievements: [],
            };
        }

        userProgress[userId].interactionCount++;
        const unlockedAchievements = [];

        // Check for 'First Words' achievement
        if (userProgress[userId].interactionCount === 1 && !userProgress[userId].achievements.includes('first_words')) {
            userProgress[userId].achievements.push('first_words');
            unlockedAchievements.push('first_words');
        }

        // Check for '100 Achievements' achievement
        if (userProgress[userId].interactionCount === 100 && !userProgress[userId].achievements.includes('100_achievements')) {
            userProgress[userId].achievements.push('100_achievements');
            unlockedAchievements.push('100_achievements');
        }

        await saveBotProgress(userProgress);

        const userQuery = args.join(' ').toLowerCase();
        let catResponseText = catResponses[userQuery] || defaultCatResponses[Math.floor(Math.random() * defaultCatResponses.length)];

        message.reply(catResponseText);

        for (const achId of unlockedAchievements) {
            const achievement = achievements[achId];
            if (achievement) {
                const achievementEmbed = {
                    color: 0xffd700,
                    title: `${achievement.icon} Achievement Unlocked: ${achievement.name}!`, 
                    description: achievement.description,
                    fields: [
                        {
                            name: 'User',
                            value: userTag,
                            inline: true,
                        },
                        {
                            name: 'Interactions',
                            value: userProgress[userId].interactionCount.toString(),
                            inline: true,
                        },
                    ],
                    timestamp: new Date().toISOString(),
                };
                message.channel.send({ embeds: [achievementEmbed] });
            }
        }
    } else if (command === 'me') {
        const userId = message.author.id;
        const userTag = message.author.tag;
        const userProgress = await loadBotProgress();

        const userData = userProgress[userId];

        if (!userData || (userData.interactionCount === 0 && userData.achievements.length === 0)) {
            return message.reply('You haven\'t interacted with me yet! Try using `.ask`.');
        }

        const achievementList = userData.achievements.length > 0
            ? userData.achievements.map(achId => `${achievements[achId]?.icon} ${achievements[achId]?.name}`).join('\n')
            : 'No achievements unlocked yet.';

        const meEmbed = {
            color: 0x00ff00,
            title: `${userTag}'s Cat Bot Progress`,
            fields: [
                {
                    name: 'Total Interactions (with .ask)',
                    value: userData.interactionCount.toString(),
                    inline: true,
                },
                {
                    name: 'Unlocked Achievements',
                    value: achievementList,
                },
            ],
            timestamp: new Date().toISOString(),
        };

        message.reply({ embeds: [meEmbed] });
    }

    // Command handling will go here in subsequent steps
    console.log(`Command received: ${command}, Arguments: ${args}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, user } = interaction;

    if (commandName === 'progress') {
        await interaction.deferReply({ ephemeral: true }); // Defer the reply as we'll be making an API call

        try {
            const response = await fetch(`${process.env.API_URL}/api/progress?userId=${user.id}`, {
                headers: {
                    'x-bot-api-key': process.env.BOT_API_KEY,
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
    } else if (commandName === 'ban') {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
        }

        const userToBan = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (!userToBan) {
            return interaction.reply({ content: 'Could not find the user to ban.', ephemeral: true });
        }

        const memberToBan = await interaction.guild.members.fetch(userToBan.id);

        if (!memberToBan) {
            return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
        }

        if (!memberToBan.bannable) {
            return interaction.reply({ content: 'I cannot ban that user. They might have a higher role or I lack permissions.', ephemeral: true });
        }

        try {
            await memberToBan.ban({ reason });
            await interaction.reply({ content: `Successfully banned ${userToBan.tag} for: ${reason}`, ephemeral: true });
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'There was an error trying to ban the user.', ephemeral: true });
        }
    } else if (commandName === 'kick') {
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
        }

        const userToKick = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (!userToKick) {
            return interaction.reply({ content: 'Could not find the user to kick.', ephemeral: true });
        }

        const memberToKick = await interaction.guild.members.fetch(userToKick.id);

        if (!memberToKick) {
            return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
        }

        if (!memberToKick.kickable) {
            return interaction.reply({ content: 'I cannot kick that user. They might have a higher role or I lack permissions.', ephemeral: true });
        }

        try {
            await memberToKick.kick(reason);
            await interaction.reply({ content: `Successfully kicked ${userToKick.tag} for: ${reason}`, ephemeral: true });
        } catch (error) {
            console.error('Error kicking user:', error);
            await interaction.reply({ content: 'There was an error trying to kick the user.', ephemeral: true });
        }
    } else if (commandName === 'timeout') {
        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to timeout members.', ephemeral: true });
        }

        const userToTimeout = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (!userToTimeout) {
            return interaction.reply({ content: 'Could not find the user to timeout.', ephemeral: true });
        }

        const memberToTimeout = await interaction.guild.members.fetch(userToTimeout.id);

        if (!memberToTimeout) {
            return interaction.reply({ content: 'That user is not in this server.', ephemeral: true });
        }

        if (!memberToTimeout.moderatable) {
            return interaction.reply({ content: 'I cannot timeout that user. They might have a higher role or I lack permissions.', ephemeral: true });
        }

        try {
            await memberToTimeout.timeout(duration * 1000, reason); // duration is in seconds, timeout expects milliseconds
            await interaction.reply({ content: `Successfully timed out ${userToTimeout.tag} for ${duration / 60} minutes for: ${reason}`, ephemeral: true });
        } catch (error) {
            console.error('Error timing out user:', error);
            await interaction.reply({ content: 'There was an error trying to timeout the user.', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);