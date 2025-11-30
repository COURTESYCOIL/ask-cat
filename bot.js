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