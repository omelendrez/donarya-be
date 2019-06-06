const { User } = require('../models')

const create = async (req, res) => {
  return User.create(req.body)
    .then(user => {
      const { fullName, username, email, dni, address, phone, createdAt, updatedAt } = user
      const data = {
        fullName, email, username, dni, address, phone, createdAt, updatedAt
      }
      res.status(201).json(data)
    })
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
    return res.status(401).json({ message: 'Email no registrado' })
  }
  try {
    await user.comparePassword(password)
  } catch (error) {
    return res.status(401).json({ error, message: 'Contraseña incorrecta' })
  }

  res.status(200).json({ message: 'Ok', user: user.getData(), token: user.getJWT() })

}
module.exports.auth = auth