const express = require('express');//import the package
const app = express();//execute the package

const mongoose = require('mongoose');//connect to db
const bodyParser = require('body-parser');//parse our request and give us the correct way to handle our data otherwise it will be undefined but this will convert it to JSON

app.use(bodyParser.json());//we created this middleware for the above reasons

//Import routes Routing refers to how an application’s endpoints (URIs) respond to client requests.
const postsRoute = require('/Users/gyorgyperegi/ET-projects/resmanagement/backend/api');

app.use('/', postsRoute); //everytime we go to api the above specified postRoutes are going to run //work as our middleware

//Connect to db
mongoose.connect('mongodb://localhost:27017/resource_management', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => { //this will help to build up the connection, we will have the mongodb protocol the localhost with default port number and the db name
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err ) }
});

app.listen(9000);