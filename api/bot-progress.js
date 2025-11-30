const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    // Authenticate the bot request using a shared secret
    const botSecret = req.headers['x-bot-secret'];
    if (botSecret !== process.env.BOT_API_SECRET) {
        return res.status(403).json({ error: 'Unauthorized bot access' });
    }

    if (req.method === 'GET') {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const { data, error } = await supabase
            .from('user_progress')
            .select('interaction_count, unlocked_achievements')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            // Return default progress for new users
            return res.json({ interactionCount: 0, unlockedAchievements: {} });
        }

        res.json({
            interactionCount: data.interaction_count,
            unlockedAchievements: data.unlocked_achievements
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};