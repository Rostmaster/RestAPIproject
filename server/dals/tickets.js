const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let ticketsDal = {

    //? Tickets CRUD
    getAll: async () => {
        const tickets = await data_base.raw("select * from tickets order by id asc")
        return {
            status: "success",
            data: tickets.rows
        }
    },
    get: async (id) => {
        const ticket = await data_base.raw(`select * from tickets where id = ${id}`)
        return {
            status: "success",
            data: ticket.rows[0]
        }
    },
    add: async (ticket) => {
        try {
            delete ticket.id
            const result_ids = await data_base('tickets').insert(ticket).returning('id');
            const id = result_ids[0].id
            return {
                status: "success",
                data: { id, ...ticket }
            }
        }
        catch (error) {
            console.log('insert failed!', error.message.replaceAll("\"", "'"));
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }
        }
    },
    update: async (id, ticket) => {
        try {
            await data_base.raw(`UPDATE tickets set flight_id=?,customer_id=? where id=?`,
                [
                    ticket.flight_id ? ticket.flight_id : 0,
                    ticket.customer_id ? ticket.customer_id : 0,
                    id
                ])
            const result = await data_base.raw(`select * from tickets where id = ${id}`)

            return {
                status: "success",
                data: result.rows[0]
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
    patch: async (id, ticket) => {
        try {
            const query_arr = []
            for (let key in ticket) {
                query_arr.push(`${key}='${ticket[key]}'`)
            }

            if (query_arr.length > 0) {
                const query = `UPDATE tickets set ${query_arr.join(', ')} where id=${id}`
                await data_base.raw(query)
            const result = await data_base.raw(`select * from tickets where id = ${id}`)

                return {
                    status: "success",
                    data: { id, ...result.rows[0] }
                }
            }

            console.log('updated successfully for id ' + id);

            return {
                status: "success",
                data: { id, ...ticket }
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
            const result = await data_base.raw(`DELETE from tickets where id=${id}`)
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
    //? Tickets Custom CRUD requests
    getTicketsByUser: async (user_id) => {
        const tickets = await data_base.raw(`select * from tickets where customer_id = ${user_id}`)
        return {
            status: "success",
            data: tickets.rows
        }
    },
    getTicketsByFlightId: async (flight_id) => {
        const tickets = await data_base.raw(`select * from tickets where flight_id = ${flight_id}`)
        return {
            status: "success",
            data: tickets.rows
        }
    },
    getTicketsByCustomerId: async (customer_id) => {
        const tickets = await data_base.raw(`select * from tickets where customer_id = ${customer_id}`)
        return {
            status: "success",
            data: tickets.rows
        }
    },

    //? Tickets Table 
    createTable: async () => {
        await data_base.schema.hasTable('tickets').then((exists) => {
            if (!exists)
                return data_base.schema.createTable('tickets', (table) => {
                    table.increments('id').primary()
                    table.integer('flight_id').notNullable()
                        .references('id').inTable('flights')
                    table.integer('customer_id').notNullable()
                        .references('id').inTable('customers')
                })
        }).catch((err) => {
            console.log(err)
        })

        return {
            status: "success",
            data: { message: "table tickets created" }
        }
    },
    dropTable: async () => {
        await data_base.schema.dropTableIfExists('tickets')
        return {
            status: "success",
            data: { message: "table tickets dropped" }
        }
    },
    fillTable: async () => {
        await data_base('tickets').insert([
            {
                flight_id: 1,
                customer_id: 1
            },
            {
                flight_id: 2,
                customer_id: 2
            },
            {
                flight_id: 3,
                customer_id: 3
            },
            {
                flight_id: 4,
                customer_id: 4
            },
            {
                flight_id: 5,
                customer_id: 5
            },
            {
                flight_id: 6,
                customer_id: 6
            },
            {
                flight_id: 7,
                customer_id: 7
            }
        ])
        return {
            status: "success",
            data: { message: "table tickets filled" }
        }
    }

}

module.exports = ticketsDal;



//? FOR TESTING ONLY
// console.clear()
// ticketsDal.createTable()
// // ticketsDal.fillTable()
// ticketsDal.dropTable()
// ticketsDal.getAll()
// ticketsDal.get(1)
// ticketsDal.add({flight_id:8, customer_id:9})
// ticketsDal.update(8, { flight_id: 9, customer_id: 9 })
// ticketsDal.patch(8, { customer_id: 8})
// ticketsDal.delete(8)
