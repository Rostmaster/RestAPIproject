const bcrypt = require('bcrypt')

const securityService = {

    toEncrypt: (data) => {
        const salt = bcrypt.genSaltSync()
        return bcrypt.hashSync(data, salt)
    },
    compare: async (password1, password2) => {
        
        return await bcrypt.compare(password1, password2)
    }
}

module.exports = securityService;