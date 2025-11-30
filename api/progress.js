
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    let userId;

    // Bot authentication using x-bot-api-key header
    if (req.headers['x-bot-api-key'] && req.query.userId) {
        if (req.headers['x-bot-api-key'] !== process.env.BOT_API_KEY) {
            return res.status(403).json({ error: 'Forbidden: Invalid bot secret' });
        }
        userId = req.query.userId;
    } else {
        // Website authentication using auth-token cookie
        if (!req.headers.cookie) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const cookies = cookie.parse(req.headers.cookie);
        const token = cookies['auth-token'];

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('user_progress')
            .select('interaction_count, unlocked_achievements')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.json({ interactionCount: 0, unlockedAchievements: {} });
        }

        res.json({
            interactionCount: data.interaction_count,
            unlockedAchievements: data.unlocked_achievements
        });
    } else if (req.method === 'POST') {
        const { interactionCount, unlockedAchievements } = req.body;

        const { error } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                interaction_count: interactionCount,
                unlocked_achievements: unlockedAchievements
            });

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).send('Progress saved.');
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
