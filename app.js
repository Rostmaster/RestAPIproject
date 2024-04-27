//? Libraries
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('config');
const path = require('path');

//? Routers
const usersRouter = require('./routers/users.js');
const ticketsRouter = require('./routers/tickets.js');
const flightsRouter = require('./routers/flights.js');
const customersRouter = require('./routers/customers.js');
const countriesRouter = require('./routers/countries.js');
const airlinesRouter = require('./routers/airlines.js');
const globalServicesRouter = require('./routers/globalServices.js');
const pagesRouter = require('./routers/pages.js');

const app = express();

//? Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());

//? Routers

//TODO move the router to the services file ======================
const globalServices = require("./services/globalServices.js")
app.get('/api/services/get_active_flights', async (req, res) => {
    let result = await globalServices.getActiveFlights(req, res)
    res.status(200).json(result)
})
//TODO============================================================

app.use('/api/services/', globalServicesRouter);
app.use('/api/users/', usersRouter);
app.use('/api/tickets/', ticketsRouter);
app.use('/api/flights/', flightsRouter);
app.use('/api/customers/', customersRouter);
app.use('/api/countries/', countriesRouter);
app.use('/api/airlines/', airlinesRouter);
app.use('/', pagesRouter);//* Must be the last one

//? Static files
app.set('view engine', 'pug');
app.set("views", path.join(".", "views"));
app.use(express.static(path.join('.', 'views')))

app.listen(config.server.port, () => {
    console.clear();
    console.log(`Server is running on port ${config.server.port}`);
});