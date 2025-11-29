const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase
// IMPORTANT: Make sure DATABASE_SUPABASE_URL and DATABASE_SUPABASE_SERVICE_ROLE_KEY are set in your Vercel environment variables
const supabaseUrl = process.env.DATABASE_SUPABASE_URL;
const supabaseKey = process.env.DATABASE_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// GET endpoint to retrieve user data
app.get('/api/progress/:userId', async (req, res) => {
    const { userId } = req.params;

    const { data, error } = await supabase
        .from('user_progress')
        .select('interaction_count, unlocked_achievements')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = 'No rows found'
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        // User not found, return default progress
        return res.json({
            interactionCount: 0,
            unlockedAchievements: {}
        });
    }

    // Map snake_case from DB to camelCase for the client
    res.json({
        interactionCount: data.interaction_count,
        unlockedAchievements: data.unlocked_achievements
    });
});

// POST endpoint to save user data (using upsert)
app.post('/api/progress/:userId', async (req, res) => {
    const { userId } = req.params;
    const { interactionCount, unlockedAchievements } = req.body;

    const { error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: userId,
            interaction_count: interactionCount,
            unlocked_achievements: unlockedAchievements
        });

    if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(200).send('Progress saved.');
});

// DELETE endpoint to delete user data
app.delete('/api/progress/:userId', async (req, res) => {
    const { userId } = req.params;

    const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId);

    if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
    }

    res.status(200).send('Progress deleted.');
});

// --- Discord OAuth2 Routes ---

// 1. Redirect to Discord Login


// 2. Callback Endpoint
app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('No code provided.');
    }

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://ask-cat.vercel.app/auth/callback',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = tokenResponse.data;

        // Use the access token to get user info
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const { id, username } = userResponse.data;

        // Here you would typically save the user to your database if they don't exist
        // For now, we'll just send a success message
        res.send(`<h1>Welcome, ${username}!</h1><p>Your Discord ID is ${id}. You are now logged in.</p>`);

    } catch (error) {
        console.error('OAuth Callback Error:', error.response ? error.response.data : error.message);
        res.status(500).send('An error occurred during authentication.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
