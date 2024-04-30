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
                fetchFavorites(username);
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
        const pin = document.getElementById('register-pin').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password, pin})
            });
            const result = await response.text();
            alert(result);
        } catch (error) {
            console.error('Registration error:', error);
            alert('Error registering');
        }
    });

    document.getElementById('fav-button').addEventListener('click', async function(event) {
        event.preventDefault();
        const locationName = document.getElementById('location').value;
        console.log(locationName);
        const userId = document.getElementById('login-username').value
        console.log(userId)

        try {
            const response = await fetch('/favorite', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId, locationName})
            });
            const result = await response.text();
            alert(result);
        } catch (error) {
            console.error('Error favoriting:', error);
            alert('Error favoriting');
        }
        fetchFavorites(userId);
    });

    document.getElementById('change-password-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('change-password-username').value;
        const currentPin = document.getElementById('pin').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, oldPassword: currentPin, newPassword })
            });

            if (response.ok) {
                alert('Password changed successfully');
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Error changing password. Please try again later.');
        }
    });

});

async function fetchAndDisplayWeather(location) {
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    const locationDisplay = document.getElementById('location-display');
    const weatherDescription = document.getElementById('weather-description');
    const temperature = document.getElementById('temperature');
    const weatherImage = document.getElementById('weather-image');
    const favButton = document.getElementById('fav-button');

    locationDisplay.textContent = `Weather for: ${location}`;

    try {
        const response = await fetch(`/weather?location=${encodeURIComponent(location)}`);
        const weatherInfo = await response.json();

        if (weatherInfo && weatherInfo.description) {
            weatherDescription.textContent = `Description: ${weatherInfo.description}`;
            temperature.textContent = `Temperature: ${weatherInfo.temperature} °F`;
            weatherImage.src = weatherInfo.imageUrl;
            weatherImage.style.display = 'block';
            favButton.style.display = 'block';
        } else {
            alert('Failed to fetch weather information.');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather information.');
    }
}

function displayFavorites(favorites) {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';

    favorites.forEach(fav => {
        const item = document.createElement('li');
        item.textContent = fav.locationName;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.id = 'delete-button';
        deleteButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/favorite/delete', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ userId: fav.userId, locationName: fav.locationName })
                });
                const result = await response.text();
                alert(result);
                fetchFavorites(fav.userId);
            } catch (error) {
                console.error('Error deleting favorite:', error);
                alert('Error deleting favorite');
            }
        });

        item.appendChild(deleteButton);

        item.style.cursor = 'pointer';
        item.addEventListener('click', () => fetchAndDisplayWeather(fav.locationName));

        favoritesList.appendChild(item);
    });
}


document.getElementById('location-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const locationInput = document.getElementById('location');
    const location = locationInput.value.trim();

    fetchAndDisplayWeather(location);
});

async function fetchFavorites(username) {
    try {
        const response = await fetch(`/favorites/${username}`);
        if (response.ok) {
            const favorites = await response.json();
            const list = document.getElementById('favoritesList');
            list.innerHTML = '';
            displayFavorites(favorites);
        } else {
            console.error('Failed to fetch favorites');
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}