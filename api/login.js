
module.exports = (req, res) => {
    const { CLIENT_ID } = process.env;
    if (!CLIENT_ID) {
        return res.status(500).send('CLIENT_ID environment variable not set.');
    }
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent('https://ask-cat.vercel.app/api/auth/callback')}&response_type=code&scope=identify`;
    res.redirect(discordAuthUrl);
};
