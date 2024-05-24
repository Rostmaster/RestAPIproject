const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let countriesDal = {

    //? Countries CRUD
    getAll: async () => {
        const countries = await data_base.raw("select * from countries order by name asc")
        return {
            status: "success",
            data: countries.rows
        }
    },
    get: async (id) => {
        const countries = await data_base.raw(`select * from countries where id = ${id}`)
        if (countries.rows[0] === undefined) throw new Error(`_country ${id} not found`)
        return {
            status: "success",
            data: countries.rows[0]
        }
    },
    add: async (country) => {
        try {
            delete country.id
            const result_ids = await data_base('countries').insert(country).returning('id');
            const id = result_ids[0].id // the new id
            return {
                status: "success",
                data: { id, ...country }
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
    update: async (id, country) => {
        try {
            const result = await data_base.raw(`UPDATE countries set name=? where id=?`,
                [
                    country.name ? country.name : '',
                    id
                ])

            return {
                status: "success",
                data: { id, ...country }
            }
        }
        catch (error) {
            console.log('updated failed for id ' + id, error.ErrorMessage);
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }

        }
    },
    delete: async (id) => {
        try {
            await data_base.raw(`DELETE from countries where id=${id}`)
            return {
                status: "success",
                data: { id }
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
    //? Countries Custom CRUD Actions
    getCountriesByFlights: async (flights) => {
        let countries = {}
        const updatedFlights = []

        for (flight of flights) {
            let origin_country = ''
            let destination_country = ''
            if (flight.origin_country_id in countries) {
                origin_country = countries[flight.origin_country_id]
            }
            else {
                let country = await data_base.raw(`select * from countries where id = ${flight.origin_country_id}`)
                countries[flight.origin_country_id] = country.rows[0].name
                origin_country = countries[flight.origin_country_id]
            }

            if (flight.destination_country_id in countries) {
                destination_country = countries[flight.destination_country_id]
            }
            else {
                let country = await data_base.raw(`select * from countries where id = ${flight.destination_country_id}`)
                countries[flight.destination_country_id] = country.rows[0].name
                destination_country = countries[flight.destination_country_id]
            }

            updatedFlights.push({ ...flight, origin_country, destination_country })
        }
        return {
            status: "success",
            data: updatedFlights
        }
    },
    //? Countries Table
    createTable: async () => {
        await data_base.schema.hasTable('countries').then((exists) => {
            if (!exists)
                return data_base.schema.createTable('countries', (table) => {
                    table.increments('id').primary()
                    table.string('name').notNullable().unique()
                })
        }).catch((err) => {
            console.log(err)
        })
        return {
            status: "success",
            data: "countries table created successfully"
        }
    },
    dropTable: async () => {
        await data_base.schema.dropTableIfExists('countries')
        return {
            status: "success",
            data: "countries table dropped successfully"
        }
    },
    fillTable: async () => {
        await data_base('countries').insert([
            {
                name: 'USA'
            },
            {
                name: 'China'
            },
            {
                name: 'Japan'
            },
            {
                name: 'India'
            },
            {
                name: 'Singapore'
            },
            {
                name: 'Taiwan'
            },
            {
                name: 'Thailand'
            }
        ])
        return {
            status: "success",
            data: "countries table filled successfully"
        }
    }

}

module.exports = countriesDal;



//? FOR TESTING ONLY
// console.clear()
// countriesDal.createTable()
// countriesDal.fillTable()
// countriesDal.dropTable()
// countriesDal.getAll()
// countriesDal.get(1)
// countriesDal.add({name:'Germany'})
// countriesDal.update(2, { name: 'CHINA' })
// countriesDal.delete(8)
