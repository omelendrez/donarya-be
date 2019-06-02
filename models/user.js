const bcrypt = require('bcrypt')
const bcrypt_p = require('bcrypt-promise')
const jwt = require('jsonwebtoken')
const CONFIG = require('../config')
const { throwErr } = require('../helpers')

module.exports = (sequelize, type) => {
  const Model = sequelize.define('User', {
    name: type.STRING,
    username: type.STRING,
    dni: type.NUMERIC,
    phone: type.STRING,
    email: type.STRING,
    address: type.STRING,
    password: type.STRING
  })

  Model.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(user.password, salt)
      user.password = hash
    }
  })

  Model.prototype.comparePassword = async function (pw) {
    if (!this.password) {
      throwErr('Password was not set')
    }
    const pass = await bcrypt_p.compare(pw, this.password)
    if (!pass) throwErr('Invalid password')
    return this
  }

  Model.prototype.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration)
    return (
      'Bearer ' +
      jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, {
        expiresIn: expiration_time
      })
    )
  }

  return Model
}