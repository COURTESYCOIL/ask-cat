
module.exports = (req, res) => {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent('https://ask-cat.vercel.app/api/auth/callback')}&response_type=code&scope=identify`;
    res.redirect(discordAuthUrl);
};
