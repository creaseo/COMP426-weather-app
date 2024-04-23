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

    document.getElementById('location-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const location = document.getElementById('location').value;
        fetchWeather(location);
    });

});

async function fetchFavorites(username) {
    console.log("THiS IS RUNNING");
    try {
        const response = await fetch(`/favorites/${username}`);
        if (response.ok) {
            const favorites = await response.json();
            const list = document.getElementById('favoritesList');
            list.innerHTML = '';  // Clear existing items
            displayFavorites(favorites);
            // favorites.forEach(fav => {
            //     const item = document.createElement('div');
            //     item.textContent = fav.locationName;
            //     list.appendChild(item);
            // });
        } else {
            console.error('Failed to fetch favorites');
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

function displayFavorites(favorites) {
    const favoritesList = document.getElementById('favoritesList'); // Ensure this element exists in your HTML
    favoritesList.innerHTML = '';  // Clear existing entries

    favorites.forEach(fav => {
        const item = document.createElement('li');
        item.textContent = fav.locationName; // Assuming the favorite object has a 'locationName' property
        favoritesList.appendChild(item);
    });
}
