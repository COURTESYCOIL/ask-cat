
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    const { code } = req.query;
    const { CLIENT_ID, CLIENT_SECRET, JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (!CLIENT_ID || !CLIENT_SECRET || !JWT_SECRET) {
        return res.status(500).send('Missing critical environment variables.');
    }

    if (!code) {
        return res.status(400).send('No code provided.');
    }

    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://ask-cat.vercel.app/auth/callback',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Failed to fetch token:', tokenData);
            return res.status(500).send('Failed to fetch authorization token from Discord.');
        }

        const { access_token } = tokenData;

        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        
        const userData = await userResponse.json();

        if (!userResponse.ok) {
            console.error('Failed to fetch user:', userData);
            return res.status(500).send('Failed to fetch user data from Discord.');
        }

        const { id, username } = userData;

        // Upsert user progress in Supabase
        const { error: upsertError } = await supabase
            .from('user_progress')
            .upsert(
                {
                    user_id: id,
                    interaction_count: 0, // Default value for new users
                    unlocked_achievements: {}, // Default value for new users
                },
                { onConflict: 'user_id', ignoreDuplicates: true }
            );

        if (upsertError) {
            console.error('Supabase upsert error:', upsertError);
            // Continue even if upsert fails, as authentication is still successful
        }

        const token = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });

        res.setHeader('Set-Cookie', cookie.serialize('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'lax',
            maxAge: 604800, // 1 week
            path: '/',
        }));

        res.redirect('/');

    } catch (error) {
        console.error('OAuth Callback Error:', error);
        res.status(500).send('An error occurred during authentication.');
    }
};
