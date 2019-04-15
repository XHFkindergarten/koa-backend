const bcrypt = require('bcrypt')

const utils = {
  enbcrypt : password => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
  }
}

module.exports = utils