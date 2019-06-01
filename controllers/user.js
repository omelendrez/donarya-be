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
