const User = require('../models').user
const Sequelize = require('sequelize')
const TableHints = Sequelize.TableHints;
const Op = Sequelize.Op
const { noProps } = require('../helpers')

const create = async (req, res) => {
  const { email, username } = req.body
  const user = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } })
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: 'Usuario o email ya registrado' })
  }
  return User.create(req.body)
    .then(user => {
      const data = { success: true, message: 'Ok', user: { ...user.toJSON(), password: undefined } }
      res
        .status(201)
        .json(data)
    })
    .catch(err => {
      res
        .status(500)
        .json({ success: false, message: 'Error insertando datos', err })
    })
}
module.exports.create = create

const getAll = (req, res) => {
  return User
    .findAll({ tableHint: TableHints.NOLOCK })
    .then(users => res
      .status(200)
      .json({ success: true, users }))
}
module.exports.getAll = getAll

const auth = async (req, res) => {
  const { email, password } = req.body
  const user = await User
    .findOne({ where: { [Op.or]: [{ email }, { username: email }] } })
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: 'Usuario o email no registrado' })
  }
  try {
    await user.comparePassword(password)
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: 'Contraseña incorrecta' })
  }

  const userData = { ...user.getData(), ...noProps }
  res
    .status(200)
    .json({ success: true, message: 'Acceso autorizado', user: userData, token: user.getToken() })
}
module.exports.auth = auth