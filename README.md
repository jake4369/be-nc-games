# Northcoders House of Games API

This is an API for a board game review website.
Users can browse game categories, view game reviews, and leave comments on reviews.

You can go to [https://nc-games-api-yf5t.onrender.com/api] to start using the API

# Installation

To get started, you'll need to have at minimum, Node.js v19.3.0 and PostgreSQL v15.1
installed on your machine. Then, follow these steps:

# Clone the repository

git clone https://github.com/example/board-game-reviews-api.git

# Navigate to the project directory

cd be-nc-games

# Install dependencies

npm install or npm i

# Seed the database

npm run seed

# Run the tests

npm run test

# Setting Up Environment Variables

The app requires two .env files, one for testing and one for production.

To set up the .env.test file:

Create a new file in the project's root directory called .env.test.
Add the following line to the file: PGDATABASE=nc_games_test
Save the file.
To set up the .env.production file:

Create a new file in the project's root directory called .env.production.
Add the following line to the file: PGDATABASE=nc_games
Save the file.

Here, nc_games_test is the name of the database to use for running tests, and nc_games is the name of the database to use in production.

DO NOT commit these files to Github as they might contain sensitive information.
