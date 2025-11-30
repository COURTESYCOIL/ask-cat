
const cookie = require('cookie');

module.exports = (req, res) => {
    res.setHeader('Set-Cookie', cookie.serialize('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
    }));
    res.status(200).json({ message: 'Logged out' });
};
