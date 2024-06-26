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
                const errorMessageDiv = document.getElementById('error-message');
                errorMessageDiv.textContent = '';
                errorMessageDiv.style.display = 'hidden'; 
            } else {
                //alert('Login failed!');
                const errorMessageDiv = document.getElementById('error-message');
                errorMessageDiv.textContent = 'Login failed!';
                errorMessageDiv.style.display = 'block'; 
                errorMessageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Login error:', error);
            //alert('Error logging in');
            const errorMessageDiv = document.getElementById('error-message');
            errorMessageDiv.textContent = 'Error logging in';
            errorMessageDiv.style.display = 'block'; 
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
            const errorMessageDiv = document.getElementById('signup-error');
            errorMessageDiv.textContent = result;
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.style.color = 'green';
            if (result === 'Error registering user'){
                errorMessageDiv.style.color = 'red';
            }
            //alert(result);
        } catch (error) {
            console.error('Registration error:', error);
            //alert('Error registering');
            const errorMessageDiv = document.getElementById('signup-error');
            errorMessageDiv.textContent = 'Error registering';
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.style.color = 'red';

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
            // alert(result);
        } catch (error) {
            console.error('Error favoriting:', error);
            // alert('Error favoriting');
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
            //alert('New passwords do not match!');
            const errorMessageDiv = document.getElementById('reset-error');
            errorMessageDiv.textContent = 'New passwords do not match!';
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, oldPassword: currentPin, newPassword })
            });

            if (response.ok) {
                //alert('Password changed successfully');
                const errorMessageDiv = document.getElementById('reset-error');
                errorMessageDiv.textContent = 'Password changed successfully!';
                errorMessageDiv.style.display = 'block';
                errorMessageDiv.style.color = 'green';
            } else {
                const data = await response.json();
                //alert(data.message);
                const errorMessageDiv = document.getElementById('reset-error');
                errorMessageDiv.textContent = data.message;
                errorMessageDiv.style.display = 'block';
                errorMessageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error changing password:', error);
            //alert('Error changing password. Please try again later.');
            const errorMessageDiv = document.getElementById('reset-error');
            errorMessageDiv.textContent = 'Error changing password. Please try again later.';
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.style.color = 'red';
            
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
    const weatherBox = document.getElementById('weather-box');

    // weatherDescription = document.createElement('div');
    // weatherDescription.id = 'weather-description'; 

    // const flex_container = document.createElement('div');
    // flex_container.id = 'weather-box';
    // flex_container.appendChild(weatherDescription);
    // flex_container.appendChild(temperature);
    // flex_container.appendChild(weatherImage);

    locationDisplay.textContent = `Weather for: ${location}`;
    // favButton.style.display = "inline-block";
    weatherBox.style.display = "inline-block";

    try {
        const response = await fetch(`/weather?location=${encodeURIComponent(location)}`);
        const weatherInfo = await response.json();

        if (weatherInfo && weatherInfo.description) {
            weatherDescription.textContent = `Description: ${weatherInfo.description}`;
            temperature.textContent = `Temperature: ${weatherInfo.temperature} °F`;
            weatherImage.src = weatherInfo.imageUrl;
            weatherImage.style.display = 'block';
            favButton.style.display = 'block';
            const errorMessageDiv = document.getElementById('fetch-error');
                errorMessageDiv.textContent = '';
                errorMessageDiv.style.display = 'hidden';

        } else {
            // alert('Failed to fetch weather information.');
            const errorMessageDiv = document.getElementById('fetch-error');
                errorMessageDiv.textContent = 'Invalid location';
                errorMessageDiv.style.display = 'block';
                errorMessageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        // alert('Failed to fetch weather information.');
        const errorMessageDiv = document.getElementById('fetch-error');
                errorMessageDiv.textContent = 'Invalid location';
                errorMessageDiv.style.display = 'block';
                errorMessageDiv.style.color = 'red';
    }
}

function displayFavorites(favorites) {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';

    favorites.forEach(fav => {
        const item = document.createElement('li');
        item.textContent = fav.locationName;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M17.004 20L17.003 8h-1-8-1v12H17.004zM13.003 10h2v8h-2V10zM9.003 10h2v8h-2V10zM9.003 4H15.003V6H9.003z"></path><path d="M5.003,20c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2V8h2V6h-3h-1V4c0-1.103-0.897-2-2-2h-6c-1.103,0-2,0.897-2,2v2h-1h-3 v2h2V20z M9.003,4h6v2h-6V4z M8.003,8h8h1l0.001,12H7.003V8H8.003z"></path><path d="M9.003 10H11.003V18H9.003zM13.003 10H15.003V18H13.003z"></path></svg>';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/favorite/delete', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ userId: fav.userId, locationName: fav.locationName })
                });
                const result = await response.text();
                //alert(result);

                fetchFavorites(fav.userId);
            } catch (error) {
                console.error('Error deleting favorite:', error);
                // alert('Error deleting favorite');
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