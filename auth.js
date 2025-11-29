
document.addEventListener('DOMContentLoaded', async () => {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

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

    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            await fetch('/logout');
            window.location.reload();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    });
});
