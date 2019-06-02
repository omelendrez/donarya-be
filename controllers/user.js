const { User } = require('../models')

const create = async (req, res) => {
  return User.create(req.body)
    .then(user => res.status(201).json(user))
}
module.exports.create = create

const getAll = (req, res) => {
  return User.findAll().then(users => res.status(200).json(users))
}
module.exports.getAll = getAll

const auth = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ where: { email: email } })
  if (!user) {
    return res.status(403).json({ message: 'Email o password incorrectos' })
  }
  try {
    await user.comparePassword(password)
  } catch (error) {
    return res.status(403).json({ error, message: 'Email o password incorrectos' })
  }

  const { name, username, dni, address, phone, createdAt, updatedAt } = user

  const data = {
    name, email, username, dni, address, phone, createdAt, updatedAt
  }

  res.status(200).json({ message: 'Autenticación satifactoria', data, token: user.getJWT() })
}
module.exports.auth = auth