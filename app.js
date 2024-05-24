//? Libraries
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

//? Utils
const config = require('config');
const url = `${config.server.port}`
const logger = require('./server/utils/logger.js');

//? Routers
const usersRouter = require('./server/routers/users.js');
const ticketsRouter = require('./server/routers/tickets.js');
const flightsRouter = require('./server/routers/flights.js');
const customersRouter = require('./server/routers/customers.js');
const countriesRouter = require('./server/routers/countries.js');
const airlinesRouter = require('./server/routers/airlines.js');
const globalServicesRouter = require('./server/routers/globalServices.js');
const pagesRouter = require('./server/routers/pages.js');

const app = express();

//? Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());

//? Static files
app.set('view engine', 'pug');
app.set("views", path.join(".", "views" , "pug"));
app.use(express.static(path.join('.', 'views', "pug")))

//? Routers
app.use('/api/services/', globalServicesRouter);
app.use('/api/users/', usersRouter);
app.use('/api/tickets/', ticketsRouter);
app.use('/api/flights/', flightsRouter);
app.use('/api/customers/', customersRouter);
app.use('/api/countries/', countriesRouter);
app.use('/api/airlines/', airlinesRouter);
app.use('/', pagesRouter);//* Must be the last one

//?Server
app.listen(config.server.port, () => {
  console.clear();
  logger.info(`Server is started on port ${config.server.port}`);
});
