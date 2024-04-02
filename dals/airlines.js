const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let airlinesDal = {

    getAll: async () => {
        const airlines = await data_base.raw("select * from airlines")
        console.log(airlines.rows.map(s => `[ID:${s.id}], ${s.name}`));
        return {
            status: "success",
            data: airlines.rows
        }
    },
    get: async (id) => {
        const airlines = await data_base.raw(`select * from airlines where id = ${id}`)
        console.log(airlines.rows[0]);
        return {
            status: "success",
            data: airlines.rows[0]
        }
    },
    add: async (airline) => {
        try {
            delete airline.id
            const result_ids = await data_base('airlines').insert(airline).returning('id');
            console.log(result_ids[0]);
            const id = result_ids[0].id
            console.log('insert succeed!');
            return {
                status: "success",
                data: { id, ...airline }
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
    update: async (id, airline) => {
        try {
            const result = await data_base.raw(`UPDATE airlines set name=?,country_id=?, user_id=? where id=?`,
                [
                    airline.name ? airline.name : '',
                    airline.country_id ? airline.country_id : 0,
                    airline.user_id ? airline.user_id : 0,
                    id
                ])
            console.log('updated succeeded for id ' + id);
            return {
                status: "success",
                data: result.rowCount
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
    patch: async (id, airline) => {
        try {
            const query_arr = []
            for (let key in airline) {
                query_arr.push(`${key}='${airline[key]}'`)
            }

            if (query_arr.length > 0) {
                const query = `UPDATE airlines set ${query_arr.join(', ')} where id=${id}`
                const result = await data_base.raw(query)
                return {
                    status: "success",
                    data: result.rowCount
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
            const result = await data_base.raw(`DELETE from airlines where id=${id}`)
            console.log(result.rowCount);
            return {
                status: "success",
                data: result.rowCount
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
        await data_base.schema.hasTable('airlines').then((exists) => {
            if (!exists)
                return data_base.schema.createTable('airlines', (table) => {
                    table.increments('id').primary()
                    table.string('name').notNullable()
                    table.integer('country_id').notNullable()
                    table.integer('user_id').notNullable()
                })
        }).catch((err) => {
            console.log(err)
        })
    },
    dropTable: async () => {
        return await data_base.schema.dropTableIfExists('airlines')
    },
    fillTable: async () => {
        return await data_base('airlines').insert([
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
    }

}

module.exports = airlinesDal;

//? FOR TESTING ONLY
// console.clear()
// airlinesDal.createTable()
// airlinesDal.fillTable()
// airlinesDal.dropTable()
// airlinesDal.getAll()
// airlinesDal.get(1)
// airlinesDal.add({name:"Germany Airways",country_id:8, user_id:9})
// airlinesDal.update(8,{name:"Germany Airways",country_id:8, user_id:8})
// airlinesDal.patch(8, { user_id: 9})
// airlinesDal.delete(8)
