
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('No code provided.');
    }

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://ask-cat.vercel.app/api/auth/callback',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const { id, username } = userResponse.data;

        const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.setHeader('Set-Cookie', cookie.serialize('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'lax',
            maxAge: 604800, // 1 week
            path: '/',
        }));

        res.redirect('/');

    } catch (error) {
        console.error('OAuth Callback Error:', error.response ? error.response.data : error.message);
        res.status(500).send('An error occurred during authentication.');
    }
};
