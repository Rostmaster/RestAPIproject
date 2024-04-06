const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('config');
const usersRouter = require('./routers/users.js');
const ticketsRouter = require('./routers/tickets.js');
const flightsRouter = require('./routers/flights.js');
const customersRouter = require('./routers/customers.js');
const countriesRouter = require('./routers/countries.js');
const airlinesRouter = require('./routers/airlines.js');
const app = express();
console.clear()

app.use(cors());
app.use(bodyParser.json());
app.use('/api/users/',usersRouter);
app.use('/api/tickets/',ticketsRouter);
app.use('/api/flights/',flightsRouter);
app.use('/api/customers/',customersRouter);
app.use('/api/countries/',countriesRouter);
app.use('/api/airlines/',airlinesRouter);

// app.use('/api',gradesRouter);
// app.use(tableToolsRouter);
// app.set('view engine', 'pug');
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join('.', '/static/'))) 

// app.get("/", (req, res) => {
//     res.render("homepage");
// });

app.use((req, res, next) => { 
    res.status(404).send( 
        "<h1>Page not found on the server</h1>") 
}) 

app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
});