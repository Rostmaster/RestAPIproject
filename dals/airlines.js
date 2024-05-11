const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let airlinesDal = {

    //? Airlines CRUD
    getAll: async () => {
        const airlines = await data_base.raw("select * from airlines order by id asc")
        return {
            status: "success",
            data: airlines.rows
        }
    },
    get: async (id) => {
        const airlines = await data_base.raw(`select * from airlines where id = ${id}`)
        if (airlines.rows[0] === undefined) throw new Error(`_airline ${id} not found`)
        return {
            status: "success",
            data: airlines.rows[0]
        }
    },
    add: async (airline) => {
        try {
            delete airline.id
            const result_ids = await data_base('airlines').insert(airline).returning('id');
            const id = result_ids[0].id
            return {
                status: "success",
                data: { id, ...airline }
            }
        }
        catch (e) {
            return {
                status: "error",
                internal: false,
                error: e.message.replaceAll("\"", "'")
            }
        }
    },
    update: async (id, airline) => {
        try {
            await data_base.raw(`UPDATE airlines set name=?,country_id=?, user_id=? where id=?`,
                [
                    airline.name ? airline.name : '',
                    airline.country_id ? airline.country_id : 0,
                    airline.user_id ? airline.user_id : 0,
                    id
                ])
            const result = await data_base.raw(`select * from airlines where id = ${id}`)
            if (result.rows[0] === undefined) throw new Error(`_airline ${id} not found`)
            return {
                status: "success",
                data: { id, ...result.rows[0] }
            }
        }
        catch (error) {
            return {
                status: "error",
                internal: false,
                error: `_${error.message.replaceAll("\"", "'")}`
            }

        }
    },
    patch: async (id, airline) => {
        try {
            const query_arr = []
            for (let key in airline) {
                query_arr.push(`${key}='${airline[key]}'`)
            }

            if (query_arr.length > 0) {
                const query = `UPDATE airlines set ${query_arr.join(', ')} where id=${id}`
                await data_base.raw(query)
                const result = await data_base.raw(`select * from airlines where id = ${id}`)
                if (result.rows[0] === undefined) throw new Error(`_airline ${id} not found`)
                return {
                    status: "success",
                    data: { id, ...result.rows[0] }
                }
            }

            return {
                status: "success",
                data: { id, ...airline }
            }
        }
        catch (error) {
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }

        }
    },
    delete: async (id) => {
        try {
            const result = await data_base.raw(`DELETE from airlines where id=${id}`)
            return {
                status: "success",
                data: { id }
            }
        }
        catch (error) {
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }
        }
    },
    
    //? Airlines Custom CRUD Actions
    getAirlinesByFlights: async (flights) => {
        let airlines = {}
        const updatedFlights = []

        for (flight of flights) {
            if (airlines[flight.airline_id]) {
                updatedFlights.push({ ...flight, airline: airlines[flight.airline_id] })
            }
            else {
                let airline = await data_base.raw(`select * from airlines where id = ${flight.airline_id}`)
                airlines[flight.airline_id] = airline.rows[0].name
                updatedFlights.push({ ...flight, airline: airlines[flight.airline_id] })
            }
        }

        return {
            status: "success",
            data: updatedFlights
        }
    },
    getAirlinesByUserId: async (user_id) => {
        const airlines = await data_base.raw(`select * from airlines where user_id = ${user_id}`)
        return {
            status: "success",
            data: airlines.rows
        }
    },
    getAirlinesByCountryId: async (country_id) => {
        const airlines = await data_base.raw(`select * from airlines where country_id = ${country_id}`)
        return {
            status: "success",
            data: airlines.rows
        }
    },
    //? Airlines Table
    createTable: async () => {
        await data_base.schema.hasTable('airlines').then((exists) => {
            if (!exists)
                return data_base.schema.createTable('airlines', (table) => {
                    table.increments('id').primary()
                    table.string('name').notNullable().unique()
                    table.integer('country_id').notNullable()
                        .references('id').inTable('countries')
                    table.integer('user_id').notNullable()
                        .references('id').inTable('users')
                })
        }).catch((err) => {
            return {
                status: "error",
                internal: false,
                error: err.message.replaceAll("\"", "'")
            }
        })
        return {
            status: "success",
            data: "airlines table created successfully"
        }
    },
    dropTable: async () => {
        await data_base.schema.dropTableIfExists('airlines')
        return {
            status: "success",
            data: "airlines table dropped successfully"
        }
    },
    fillTable: async () => {
        await data_base('airlines').insert([
            {
                name: 'USA Airways',
                country_id: 1,
                user_id: 1
            },
            {
                name: 'China Airways',
                country_id: 2,
                user_id: 2
            },
            {
                name: 'Japan Airways',
                country_id: 3,
                user_id: 3
            },
            {
                name: 'India Airways',
                country_id: 4,
                user_id: 4
            },
            {
                name: 'Singapore Airways',
                country_id: 5,
                user_id: 5
            },
            {
                name: 'Taiwan Airways',
                country_id: 6,
                user_id: 6
            },
            {
                name: 'Thailand Airways',
                country_id: 7,
                user_id: 7
            }
        ])
        return {
            status: "success",
            data: "airlines table filled successfully"
        }
    }

}

module.exports = airlinesDal;