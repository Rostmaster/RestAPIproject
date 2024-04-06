const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let customersDal = {

    getAll: async () => {
        const customers = await data_base.raw("select * from customers")
        console.log(customers.rows.map(s => `[ID:${s.id}], ${s.first_name} ${s.last_name}`));
        return {
            status: "success",
            data: customers.rows
        }
    },
    get: async (id) => {
        const customers = await data_base.raw(`select * from customers where id = ${id}`)
        console.log(customers.rows[0]);
        return {
            status: "success",
            data: customers.rows[0]
        }
    },
    add: async (customer) => {
        try {
            delete customer.id
            const result_ids = await data_base('customers').insert(customer).returning('id');
            console.log(result_ids[0]);
            const id = result_ids[0].id
            console.log('insert succeed!');
            return {
                status: "success",
                data: { id, ...customer }
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
    update: async (id, customer) => {
        try {
            const result = await data_base.raw(`UPDATE customers set first_name=?,last_name=?, address=?,phone_number=?, credit_card=?, user_id=? where id=?`,
                [
                    customer.first_name ? customer.first_name : '',
                    customer.last_name ? customer.last_name : '',
                    customer.address ? customer.address : '',
                    customer.phone_number ? customer.phone_number : '',
                    customer.credit_card ? customer.credit_card : '',
                    customer.user_id ? customer.user_id : 0,
                    id
                ])
            console.log('updated succeeded for id ' + id);
            return {
                status: "success",
                data: { id, ...customer }
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
    patch: async (id, customer) => {
        try {
            const query_arr = []
            for (let key in customer) {
                query_arr.push(`${key}='${customer[key]}'`)
            }

            if (query_arr.length > 0) {
                const query = `UPDATE customers set ${query_arr.join(', ')} where id=${id}`
                const result = await data_base.raw(query)
                return {
                    status: "success",
                    data: { id, ...customer }
                }
            }

            console.log('updated successfully for id ' + id);

            return {
                status: "success",
                data: query_arr.length
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
            const result = await data_base.raw(`DELETE from customers where id=${id}`)
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
        await data_base.schema.hasTable('customers').then((exists) => {
            if (!exists)
                return data_base.schema.createTable('customers', (table) => {
                    table.increments('id').primary()
                    table.string('first_name').notNullable()
                    table.string('last_name').notNullable()
                    table.string('address').notNullable()
                    table.string('phone_number').notNullable()
                    table.string('credit_card').notNullable()
                    table.integer('user_id').notNullable()
                })
        }).catch((err) => {
            console.log(err)
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
                phone_number: '123-456-7890',
                credit_card: '1234567890123456',
                user_id: 1
            },
            {
                first_name: 'Jane',
                last_name: 'Doe',
                address: '123 Secondary St',
                phone_number: '123-456-7890',
                credit_card: '1234567890123456',
                user_id: 2
            },
            {
                first_name: 'Josh',
                last_name: 'Dowson',
                address: '456 Main St',
                phone_number: '123-456-7890',
                credit_card: '1234567890123456',
                user_id: 3
            },
            {
                first_name: 'Gene',
                last_name: 'Dion',
                address: '456 Secondary St',
                phone_number: '123-456-7890',
                credit_card: '1234567890123456',
                user_id: 4
            }

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
