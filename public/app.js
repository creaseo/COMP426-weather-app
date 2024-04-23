document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            const data = await response.json();
            if (data.message === 'Login successful') {
                document.getElementById('auth-container').style.display = 'none';
                document.getElementById('weather-app').style.display = 'block';
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error logging in');
        }
    });

    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            const result = await response.text();
            alert(result);
        } catch (error) {
            console.error('Registration error:', error);
            alert('Error registering');
        }
    });
    
    document.getElementById('location-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const location = document.getElementById('location').value;
        fetchWeather(location);
    });
    
});