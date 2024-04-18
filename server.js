const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const OPENWEATHERMAP_API_KEY = '6e20dc2507a1ed015f8094bfecba53ea';
const GOOGLE_API_KEY = 'AIzaSyAaph6fXjkWcaYsWBRXMWVD9CYDsvNJYoI';
const GOOGLE_CX = 'd581af531cd44425a';

app.get('/weather', async (req, res) => {
    try {
        const location = req.query.location;
        const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHERMAP_API_KEY}&units=imperial`);
        const weatherData = await weatherResponse.json();

        console.log("Weather Data:", weatherData);

        const description = weatherData.weather[0].description;
        const temperature = weatherData.main.temp;

        const googleResponse = await fetch(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${description}&searchType=image`);
        const googleData = await googleResponse.json();

        console.log("Google Image Data:", googleData);

        const imageUrl = googleData.items[0].link;

        console.log("Image URL:", imageUrl);

        const weatherInfo = {
            description,
            temperature,
            imageUrl
        };

        console.log("Weather Info:", weatherInfo);
        res.json(weatherInfo);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
