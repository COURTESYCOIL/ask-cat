
document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    loginButton.href = '/api/login';

    try {
        const response = await fetch('/api/me');
        if (response.ok) {
            loginButton.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            loginButton.style.display = 'block';
            logoutButton.style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }

    logoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await fetch('/api/logout');
            window.location.reload();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });
});
