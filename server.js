const express = require('express');
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const OPENWEATHERMAP_API_KEY = '6e20dc2507a1ed015f8094bfecba53ea';
const GOOGLE_API_KEY = 'AIzaSyAaph6fXjkWcaYsWBRXMWVD9CYDsvNJYoI';
const GOOGLE_CX = 'd581af531cd44425a';

// Mongoose + MongoDB

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kurisu:bEgqpdInQ75YLHFZ@cluster0.132qpjy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/favorite', async (req, res) => {
    const { userId, locationName } = req.body;
    try {
        const newFav = new Favorite({ userId, locationName });
        await newFav.save();
        res.status(201).send('Location saved');
    } catch (error) {
        res.status(500).send('Error favoriting location');
    }
});

app.get('/favorites/:username', async (req, res) => {
    const userId = req.params.username;
    try {
      const favorites = await Favorite.find({ userId }).exec();  // Assuming username is a field in Favorite
      res.json(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).send('Failed to retrieve favorites');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && user.password === password) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});
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
