const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let countriesDal = {

    getAll: async () => {
        const countries = await data_base.raw("select * from countries")
        console.log(countries.rows.map(s => `[${s.id}] ${s.name}`));
        return {
            status: "success",
            data: countries.rows
        }
    },
    get: async (id) => {
        const countries = await data_base.raw(`select * from countries where id = ${id}`)
        console.log(countries.rows[0]);
        return {
            status: "success",
            data: countries.rows[0]
        }
    },
    add: async (country) => {
        try {
            delete country.id
            const result_ids = await data_base('countries').insert(country).returning('id');
            console.log(result_ids[0]);
            const id = result_ids[0].id // the new id
            console.log('insert succeed!');
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
    // patch: async (id, country) => {
    //     try {
    //         const query_arr = []
    //         for (let key in country) {
    //             query_arr.push(`${key}='${country[key]}'`)
    //         }

    //         if (query_arr.length > 0) {
    //             const query = `UPDATE countries set ${query_arr.join(', ')} where id=${id}`
    //             const result = await data_base.raw(query)
    //             return {
    //                 status: "success",
    //                 data: result.rowCount
    //             }
    //         }

    //         console.log('updated successfully for id ' + id);

    //         return {
    //             status: "success",
    //             data: query_arr.length
    //         }
    //     }
    //     catch (error) {
    //         console.log('updated failed for id ' + id);
    //         return {
    //             status: "error",
    //             internal: false,
    //             error: error.message.replaceAll("\"", "'")
    //         }

    //     }
    // },
    delete: async (id) => {
        try {
            const result = await data_base.raw(`DELETE from countries where id=${id}`)
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
        await data_base.schema.hasTable('countries').then((exists) => {
            if (!exists)
                return data_base.schema.createTable('countries', (table) => {
                    table.increments('id').primary()
                    table.string('name').notNullable()
                })
        }).catch((err) => {
            console.log(err)
        })
    },
    dropTable: async () => {
        return await data_base.schema.dropTableIfExists('countries')
    },
    fillTable: async () => {
        return await data_base('countries').insert([
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
