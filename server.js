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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
