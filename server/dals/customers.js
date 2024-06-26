const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let customersDal = {

    //? Customers CRUD
    getAll: async () => {
        const customers = await data_base.raw("select * from customers order by id asc")
        return {
            status: "success",
            data: customers.rows
        }
    },
    get: async (id) => {
        const customers = await data_base.raw(`select * from customers where id = ${id}`)
        return {
            status: "success",
            data: customers.rows[0]
        }
    },
    add: async (customer) => {
        try {
            delete customer.id
            const result_ids = await data_base('customers').insert(customer).returning('id');
            const id = result_ids[0].id
            return {
                status: "success",
                data: { id, ...customer }
            }
        }
        catch (e) {
            console.log('insert failed!', e.message.replaceAll("\"", "'"));
            return {
                status: "error",
                internal: false,
                error: e.message.replaceAll("\"", "'")
            }
        }
    },
    update: async (id, customer) => {
        try {
            await data_base.raw(`UPDATE customers set first_name=?,last_name=?, address=?,phone_number=?, credit_card=?, user_id=? where id=?`,
                [
                    customer.first_name ? customer.first_name : '',
                    customer.last_name ? customer.last_name : '',
                    customer.address ? customer.address : '',
                    customer.phone_number ? customer.phone_number : '',
                    customer.credit_card ? customer.credit_card : '',
                    customer.user_id ? customer.user_id : 0,
                    id
                ])
            const result = await data_base.raw(`select * from customers where id = ${id}`)
            if (result.rows[0] === undefined) throw new Error(`_customer ${id} not found`)
            return {
                status: "success",
                data: { id, ...result.rows[0] }
            }
        }
        catch (error) {
            console.log('updated failed for id ' + id, error.message.replaceAll("\"", "'"));
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }

        }
    },
    patch: async (id, customer) => {
        try {
            const query_arr = []
            for (let key in customer) {
                query_arr.push(`${key}='${customer[key]}'`)
            }
            if (query_arr.length > 0) {
                const query = `UPDATE customers set ${query_arr.join(', ')} where id=${id}`
                await data_base.raw(query)
                const result = await data_base.raw(`select * from customers where id = ${id}`)
                if (result.rows[0] === undefined) throw new Error(`_customer ${id} not found`)
                return {
                    status: "success",
                    data: { id, ...result.rows[0] }
                }
            }

            return {
                status: "success",
                data: query_arr.length
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
            const result = await data_base.raw(`DELETE from customers where id=${id}`)
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
    
    //? Customers Custom CRUD Actions
    getCustomersByUserId: async (user_id) => {
        try {
            const customers = await data_base.raw(`select * from customers where user_id=${user_id}`)
            return {
                status: "success",
                data: customers.rows
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

    //? Customers Table
    createTable: async () => {
        await data_base.schema.hasTable('customers').then((exists) => {
            if (!exists)
                return data_base.schema.createTable('customers', (table) => {
                    table.increments('id').primary()
                    table.string('first_name').notNullable()
                    table.string('last_name').notNullable()
                    table.string('address').notNullable()
                    table.string('phone_number').notNullable().unique()
                    table.string('credit_card').notNullable().unique()
                    table.integer('user_id').notNullable().unique()
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
            data: { message: "table customers created" }
        }
    },
    dropTable: async () => {
        await data_base.schema.dropTableIfExists('customers')
        return {
            status: "success",
            data: { message: "table customers dropped" }
        }
    },
    fillTable: async () => {
        await data_base('customers').insert([
            {
                first_name: 'John',
                last_name: 'Doe',
                address: '123 Main St',
                phone_number: '123-456-7690',
                credit_card: '123467890123456',
                user_id: 1
            },
            {
                first_name: 'Jane',
                last_name: 'Doe',
                address: '123 Secondary St',
                phone_number: '123-456-890',
                credit_card: '124567890123456',
                user_id: 2
            },
            {
                first_name: 'Josh',
                last_name: 'Dowson',
                address: '456 Main St',
                phone_number: '123-456-789',
                credit_card: '134567890123456',
                user_id: 3
            },
            {
                first_name: 'Gene',
                last_name: 'Dion',
                address: '456 Secondary St',
                phone_number: '123-456-790',
                credit_card: '234567890123456',
                user_id: 4
            },
            {
                first_name: 'John',
                last_name: 'Doe',
                address: '123 Main St',
                phone_number: '123-456-76902',
                credit_card: '1234678901234526',
                user_id: 5
            },
            {
                first_name: 'Jane',
                last_name: 'Doe',
                address: '123 Secondary St',
                phone_number: '123-456-8903',
                credit_card: '1245678901234563',
                user_id: 6
            },
            {
                first_name: 'Josh',
                last_name: 'Dowson',
                address: '456 Main St',
                phone_number: '123-456-7894',
                credit_card: '1345678901234564',
                user_id: 7
            },

        ])
        return {
            status: "success",
            data: { message: "table customers filled" }
        }
    }

}

module.exports = customersDal;

//? FOR TESTING ONLY
// console.clear()
// customersDal.createTable()
// customersDal.fillTable()
// customersDal.dropTable()
// customersDal.getAll()
// customersDal.get(1)
// customersDal.add({
//     first_name: 'Genevieve',
//     last_name: 'Dyson',
//     address: '123 Secondary St',
//     phone_number: '123-456-7890',
//     credit_card: '1234567890123456',
//     user_id: 4
// })
// customersDal.update(5,{
//         first_name: 'Genevieve',
//         last_name: 'Dyson',
//         address: '123 Secondary St',
//         phone_number: '123-456-7890',
//         credit_card: '1234567890123456',
//         user_id: 5
// })
// customersDal.patch(5, { address: '123 Hello Planet st'})
// customersDal.delete(5)
