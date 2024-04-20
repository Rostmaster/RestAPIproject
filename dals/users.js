const knex = require('knex')
const config = require('config')

const data_base = knex(config.database)

let usersDal = {

    //? User CRUD
    getAll: async () => {
        const users = await data_base.raw("select * from users")
        console.log("DAL get all", users.rows.map(s => `[ID:${s.id}], ${s.username}`));
        return {
            status: "success",
            data: users.rows
        }

    },
    get: async (id) => {
        const users = await data_base.raw(`select * from users where id = ${id}`)
        console.log("DAL get", users.rows[0]);
        return {
            status: "success",
            data: users.rows[0]
        }
    },
    add: async (user) => {
        try {
            delete user.id
            const result_ids = await data_base('users').insert(user).returning('id');
            console.log("DAL add", result_ids[0]);
            const id = result_ids[0].id
            console.log('insert succeed!');
            return {
                status: "success",
                data: { id, ...user }
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
    update: async (id, user) => {
        try {
            console.log(user)
            const result = await data_base.raw(`UPDATE users set username=?,password=?, email=? where id=?`,
                [
                    user.username ? user.username : '',
                    user.password ? user.password : 0,
                    user.email ? user.email : 0,
                    id
                ])
            console.log('DAL update:', 'updated succeeded for id ' + id);
            return {
                status: "success",
                data: { "id": id }
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
    patch: async (id, user) => {
        try {
            const query_arr = []
            for (let key in user) {
                query_arr.push(`${key}='${user[key]}'`)
            }

            if (query_arr.length > 0) {
                const query = `UPDATE users set ${query_arr.join(', ')} where id=${id}`
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
            const result = await data_base.raw(`DELETE from users where id=${id}`)
            console.log(result.rowCount);
            return {
                status: "success",
                data: { "id": id }
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

    //? Users Table
    createTable: async () => {
        await data_base.schema.hasTable('users').then((exists) => {
            if (!exists)
                return data_base.schema.createTable('users', (table) => {
                    table.increments('id').primary()
                    table.string('username').notNullable().unique()
                    table.string('password').notNullable()
                    table.string('email').notNullable().unique()
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
        return await data_base.schema.dropTableIfExists('users')
    },
    fillTable: async () => {
        let result = await data_base('users').insert([
            {
                username: 'admin',
                password: 'pass1',
                email: 'admin@pass1.com'
            },
            {
                username: 'user',
                password: 'pass2',
                email: 'user@pass2.com'
            },
            {
                username: 'guest',
                password: 'pass3',
                email: 'guest@pass3.com'
            }, {
                username: 'admin2',
                password: 'pass1',
                email: 'admin@pass12.com'
            },
            {
                username: 'user2',
                password: 'pass2',
                email: 'user@pass22.com'
            },
            {
                username: 'guest2',
                password: 'pass3',
                email: 'guest@pass32.com'
            }, {
                username: 'admin3',
                password: 'pass1',
                email: 'admin@pass13.com'
            },
            {
                username: 'user3',
                password: 'pass2',
                email: 'user@pass23.com'
            },
            {
                username: 'guest3',
                password: 'pass3',
                email: 'guest@pass33.com'
            },
        ])
        return {
            status: "success",
            data: result.rowCount
        }
    },

    //? Authentication
    login: async (email) => {
        try {
            const result = await data_base.raw(`select * from users where email = '${email}'`)
            console.log(result.rows[0]);
            return {
                status: "success",
                data: result.rows[0]
            }
        }
        catch (error) {
            console.log('login failed!');
            return {
                status: "error",
                internal: false,
                error: error.message.replaceAll("\"", "'")
            }
        }
    }

}

module.exports = usersDal;

//? FOR TESTING ONLY
// console.clear()
// usersDal.dropTable()
// usersDal.createTable()
// usersDal.fillTable()
// usersDal.getAll()
// usersDal.get(1)
// usersDal.add({username:"visitor",password:'pass3', email:'visitor@pass3.com'})
// usersDal.update(4,{username:"visitor",password:'passs3', email:'visitor@pass3.com'})
// usersDal.patch(4, { password: "pass3"})
// usersDal.delete(4)
