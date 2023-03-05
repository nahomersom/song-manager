
require('dotenv').config();
const routes = require('./routes/routes');

const express = require('express');
const mongoose = require('mongoose');

//storing the connection string
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

app.use(express.json());


//base endpoint and the contents of the routes
app.use('/api', routes)
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})