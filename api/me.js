
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = (req, res) => {
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
        res.status(200).json(decoded);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
