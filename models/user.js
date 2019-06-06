const bcrypt_p = require('bcrypt-promise')
const jwt = require('jsonwebtoken')
const CONFIG = require('../config')
const { throwErr } = require('../helpers')

module.exports = (sequelize, type) => {
  const Model = sequelize.define('User', {
    fullName: type.STRING,
    username: type.STRING,
    dni: type.NUMERIC,
    phone: type.STRING,
    email: type.STRING,
    address: type.STRING,
    password: type.STRING
  })

  Model.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      const salt = await bcrypt_p.genSalt(10)
      const hash = await bcrypt_p.hash(user.password, salt)
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

  Model.prototype.getToken = function () {
    const expiration_time = parseInt(CONFIG.jwt_expiration)
    const params = {
      userId: this.id,
      email: this.email,
      username: this.username
    }
    const token = jwt.sign(params, CONFIG.jwt_encryption, { expiresIn: expiration_time })
    return `Bearer ${token}`
  }

  Model.prototype.getData = function () {
    return this.toJSON()
  }

  return Model
}