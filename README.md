# Northcoders News API
Link to the NC-News api: https://nc-news-6t8x.onrender.com/api

This project is a API for a datbase representing news articles called NC News. It will contain 2 sets of data, one for the development and the other for testing. It will contain methods for GET, POST, PATCH and DELETE on different endpoints.

The clone the repo, the repository (https://github.com/ChannersSoh/api-project.get) would need to be copied. Then by using the command git clone followed by the given url, the reopsitory would be cloned locally.

To be able to successfully connect to the databases locally, 2 .env files would need to be createed. There would be a .env file for development and for test, which would need to contain PGDATABASE= with the correct database names. To be able to run the databases and tests, node packages specified would need to be installed. To do so, the command npm install would be used to install the needed modules outlined in the package json. To seed the database, the scripts setup-dbs (to run use: npm run setup-dbs) and seed (to run use: npm run seed). For the testing, the command npm test will run all test and npm test app.test.js will run on the tests for the app.

The minimum version for node and postgres are v21.7.3 and 14.11 respectively.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
