const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let flightsDal = {
    //get all the flights from the database with knex , return the values and not the promise
    getAll: async () => {
        const flights = await data_base.raw("select * from flights")
        console.log(flights.rows.map(s => `[${s.id}] ${s.origin_country_id} -> ${s.destination_country_id}`));
        return {
            status: "success",
            data: flights.rows
        }
    },
    get: async (id) => {
        const flights = await data_base.raw(`select * from flights where id = ${id}`)
        console.log(flights.rows[0]);
        return {
            status: "success",
            data: flights.rows[0]
        }
    },
    add: async (flight) => {
        try {
            delete flight.id
            const result_ids = await data_base('flights').insert(flight).returning('id');
            console.log(result_ids[0]);
            const id = result_ids[0].id // the new id
            console.log('insert succeed!');
            return {
                status: "success",
                data: { id, ...flight }
            }
        }
        catch (e) {
            console.log('insert failed!');
            return {
                status: "error",
                internal: false,
                error: e.message.replaceAll("\"", "'")
            }
        }
    },
    update: async (id, flight) => {
        try {
            const result = await data_base.raw(`UPDATE flights set airline_id=?,origin_country_id=?,destination_country_id=?,departure_time=?,landing_time=?,remaining_tickets=? where id=?`,
                [
                    flight.airline_id ? flight.airline_id : 0,
                    flight.origin_country_id ? flight.origin_country_id : 0,
                    flight.destination_country_id ? flight.destination_country_id : 0,
                    flight.departure_time ? flight.departure_time : '',
                    flight.landing_time ? flight.landing_time : '',
                    flight.remaining_tickets ? flight.remaining_tickets : 0,
                    id])
            console.log('updated succeeded for id ' + id);
            return {
                status: "success",
                data: { id, ...flight }
            }
        }
        catch (error) {
            console.log('updated failed for id ' + id);
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }

        }
    },
    patch: async (id, flight) => {
        try {
            const query_arr = []
            for (let key in flight) {
                query_arr.push(`${key}='${flight[key]}'`)
            }

            if (query_arr.length > 0) {
                const query = `UPDATE flights set ${query_arr.join(', ')} where id=${id}`
                const result = await data_base.raw(query)
                return {
                    status: "success",
                    data: { id, ...flight }
                }
            }

            console.log('updated successfully for id ' + id);

            return {
                status: "success",
                data: { id, ...flight }
            }
        }
        catch (error) {
            console.log('updated failed for id ' + id);
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }

        }
    },
    delete: async (id) => {
        try {
            const result = await data_base.raw(`DELETE from flights where id=${id}`)
            console.log(result.rowCount);
            return {
                status: "success",
                data: {
                    message: 'success',
                    id
                }
            }
        }
        catch (error) {
            console.log('delete failed for id ' + id);
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }
        }
    },
    createTable: async () => {
        data_base.schema.hasTable('flights').then((exists) => {
            if (!exists) {
                return data_base.schema.createTable('flights', (table) => {
                    table.increments('id').primary()
                    table.integer('airline_id').notNullable()
                    table.integer('origin_country_id').notNullable()
                    table.integer('destination_country_id').notNullable()
                    table.dateTime('departure_time').notNullable()
                    table.dateTime('landing_time').notNullable()
                    table.integer('remaining_tickets').notNullable()
                })
            }

        }).catch((err) => {
            return {
                status: "error",
                internal: false,
                error: err.message.replaceAll("\"", "'")
            }
        })
        return {
            status: "success",
            data: "table flights created"
        }
    },
    dropTable: async () => {
        await data_base.schema.dropTableIfExists('flights')
        return {
            status: "success",
            data: "table flights dropped"
        }
    },
    fillTable: async () => {
        await data_base('flights').insert([
            {
                airline_id: 1,
                origin_country_id: 1,
                destination_country_id: 2,
                departure_time: '2019-01-01 00:00:00',
                landing_time: '2019-01-01 00:00:00',
                remaining_tickets: 100
            },
            {
                airline_id: 2,
                origin_country_id: 2,
                destination_country_id: 3,
                departure_time: '2019-01-01 00:00:00',
                landing_time: '2019-01-01 00:00:00',
                remaining_tickets: 100
            },
            {
                airline_id: 3,
                origin_country_id: 3,
                destination_country_id: 1,
                departure_time: '2019-01-01 00:00:00',
                landing_time: '2019-01-01 00:00:00',
                remaining_tickets: 100
            }
        ])
        return {
            status: "success",
            data: "table flights filled"
        }
    }

}

module.exports = flightsDal;

//? FOR TESTING ONLY
// let testFlight = {
//     airline_id: 3,
//     origin_country_id: 6,
//     destination_country_id: 2,
//     departure_time: '2019-01-01 00:00:00',
//     landing_time: '2019-01-01 00:00:00',
//     remaining_tickets: 200
// }

// console.clear()
// flightsDal.createTable()
// flightsDal.fillTable()
// flightsDal.getAllFlights()
// flightsDal.getFlightById(1)
// flightsDal.addFlight(testFlight)
// flightsDal.updateFlight(10, testFlight)
// flightsDal.patchFlight(10, testFlight)
// flightsDal.deleteFlight(10)
