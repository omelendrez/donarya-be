const bcrypt_p = require('bcrypt-promise')
const jwt = require('jsonwebtoken')
const CONFIG = require('../config')
const { throwErr } = require('../helpers')

module.exports = (sequelize, type) => {
  const User = sequelize.define('user', {
    fullName: type.STRING,
    username: type.STRING,
    dni: type.NUMERIC,
    cuit: type.STRING,
    phone: type.STRING,
    email: type.STRING,
    address: type.STRING,
    password: type.STRING
  })

  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      const salt = await bcrypt_p.genSalt(10)
      const hash = await bcrypt_p.hash(user.password, salt)
      user.password = hash
    }
  })

  User.prototype.comparePassword = async function (pw) {
    if (!this.password) {
      throwErr('Password was not set')
    }
    const pass = await bcrypt_p.compare(pw, this.password)
    if (!pass) throwErr('Invalid password')
    return this
  }

  User.prototype.getToken = function () {
    const expiration_time = parseInt(CONFIG.jwt_expiration)
    const params = {
      userId: this.id,
      email: this.email,
      username: this.username
    }
    const token = jwt.sign(params, CONFIG.jwt_encryption, { expiresIn: expiration_time })
    return `Bearer ${token}`
  }

  User.prototype.getData = function () {
    return this.toJSON()
  }

  return User
}