const bcrypt = require('bcrypt')

const securityService = {

    toEncrypt: (data) => {
        const salt = bcrypt.genSaltSync()
        const encrypted = bcrypt.hashSync(data, salt)
        console.log('encrypted', data, 'to ', encrypted)
        return encrypted
    },
    compare: async (password1, password2) => {
        result =  await bcrypt.compareSync(password1, password2)
        return result
    }
}

module.exports = securityService;