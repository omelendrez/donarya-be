const Donation = require('../models').donation
const DonationItem = require('../models').donation_item
const Sequelize = require('sequelize')
const TableHints = Sequelize.TableHints;

const create = async (req, res) => {
  const uuidv1 = require('uuid/v1')
  const { description, userId, items } = req.body
  let donation = { uuid: uuidv1(), description, userId }
  return Donation.create(donation)
    .then(donation => {
      const donationId = donation.id
      const donationItems = items.map(item => {
        item.donationId = donationId
        return item
      })
      DonationItem.bulkCreate(donationItems)
        .then(items => {
          donation = donation.getData()
          donation.items = items
          const data = { success: true, message: 'Ok', donation }
          res
            .status(201)
            .json(data)
        })
        .catch(err => {
          res
            .status(500)
            .json({ success: false, message: 'Error insertando items', err })
        })
    })
    .catch(err => {
      res
        .status(500)
        .json({ success: false, message: 'Error creando donación', err })
    })
}
module.exports.create = create

const getAll = (req, res) => {
  DonationItem.belongsTo(Donation)
  Donation.hasMany(DonationItem)
  return Donation
    .findAll({
      tableHint: TableHints.NOLOCK,
      attributes: ['id', 'uuid', 'userId', 'description', 'statusId'],
      include: [
        {
          model: DonationItem,
          where: {
            donationId: Sequelize.col('donation.id')
          },
          attributes: ['id', 'title', 'quantity']
        }
      ]
    })
    .then(donations => res
      .status(200)
      .json({ success: true, donations }))
}
module.exports.getAll = getAll