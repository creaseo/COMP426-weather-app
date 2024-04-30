# COMP426 SP24 Final Project - Weather App

**Group Members:**\
Chloe Elizabeth - \
Osoo Kwon - \
Chris Oh - https://github.com/creaseo \
Li-La Youn - https://github.com/lilayoun

We developed a weather app that displays the description, temperature, and corresponding image of a specified city's weather conditions. Users are able to login into accounts that they register and will be able to save favorite locations that they can quickly go to. These favorite locations will be saved to the persistent backend and will be persistent through multiple sessions.

![Screenshot](ss.png)

## Startup
- Please use npm install to install all necessary dependencies -- this should include express, mongodb, and mongoose
- Once dependenices are installed, please open a new terminal and use the command 'node server.js' to start the application
- If completed successfully, the app should be functional at localhost:3000

## Registering and Login
- Upon loading the application, you should be at the login/registration page. If you are a returning user, please login using your correct username and corresponding password.
- If you are a new user, please register by creating a unique username and a password of your choosing.
- Upon registration, the application will not automatically log you in -- once successfully registered, please enter your new credentials in the login prompt
- Should there be any errors with registration or logging in, an alert should inform you
- User's are also able to change their password if they choose and this interface is located underneath teh registering and login prompts

## Main Application
- Once logged in, you should see our main application which includes a search box that allows you to search up any city
- Searches wil return a breif description of the weather, the temperature, and picture of the described weather

## Favoriting
- Our application allows users to save favorite locations
- Once you have searched for a city and it's results appear, there should be a favorite button under the image
- If clicked, the location will be saved to the user's favorite list which should appear under the search bar
- Each list entry is a link which allows the user to quickly go to a city's weather
- If desired, the user can also unfavorite a location by clicking the delete button next to the location name

# Backend Documentation

This project does NOT use a framework and instead relies on raw javascript, html, and css. For our backend, we chose to use MongoDB and Mongoose

# Models
 
We have two model objects which are the User model and the Favorite model.

### User
- The User model features two attributes which are username and password
- Username is required to be unique and serves as the primary key

### Favorite
- The Favorite model features two attributes which are userId and locationName
- userId serves as a foreign key and is used to load the user's saved locations upon login
- locationName saves the name of the city that the user has favorited

# API Documentation
- We have implemented 7 API endpoints which are used to implement features we believe are necessary/useful for our application. These include GET methods for the user's favorites and also weather, POST methods for Logging in, registering, and favoriting, a PUT method for changing a User's password, and a DELETE method to delete favorite locations
- Our API endpoints are located in the server.js file
