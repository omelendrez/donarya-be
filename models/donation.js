module.exports = (sequelize, type) => {
  const Donation = sequelize.define('donation', {
    uuid: {
      type: type.UUID
    },
    userId: {
      type: type.NUMERIC,
      allowNull: false
    },
    description: {
      type: type.STRING,
      defaultValue: ''
    },
    statusId: {
      type: type.NUMERIC,
      defaultValue: 0
    }
  })

  Donation.prototype.getData = function () {
    return this.toJSON()
  }

  return Donation
}