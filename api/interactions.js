
const { verifyKey } = require('discord-interactions');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
    const PUBLIC_KEY = process.env.PUBLIC_KEY;

    if (!PUBLIC_KEY) {
        console.error('Missing PUBLIC_KEY environment variable.');
        return res.status(500).send({ error: 'Internal Server Error: Missing PUBLIC_KEY' });
    }

    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const body = req.rawBody; // Vercel provides the raw body

    const isValidRequest = verifyKey(body, signature, timestamp, PUBLIC_KEY);

    if (!isValidRequest) {
        return res.status(401).send({ error: 'Bad request signature' });
    }

    const interaction = req.body;

    if (interaction.type === 1) { // PING
        return res.status(200).send({ type: 1 }); // PONG
    }

    // Handle other interaction types here (e.g., slash commands)
    if (interaction.type === 2) {
        const { name } = interaction.data;

        if (name === 'login') {
            // Handle the /login command
            return res.status(200).send({
                type: 4, // ChannelMessageWithSource
                data: {
                    content: 'Click here to login: https://ask-cat.vercel.app/api/login',
                    flags: 64 // Ephemeral
                }
            });
        }

        if (name === 'progress') {
            // Handle the /progress command
            // This will be implemented later
            return res.status(200).send({
                type: 4,
                data: {
                    content: 'The /progress command is not yet implemented.',
                    flags: 64
                }
            });
        }
    }

    return res.status(404).send({ error: 'Unknown interaction type' });
};
