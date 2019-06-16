module.exports = (sequelize, type) => {
  const DonationItem = sequelize.define('donation_item', {
    donationId: {
      type: type.NUMERIC,
      allowNull: false
    },
    title: {
      type: type.STRING,
      allowNull: false
    },
    quantity: {
      type: type.NUMERIC,
      defaultValue: 1
    }
  })

  DonationItem.prototype.getData = function () {
    return this.toJSON()
  }

  return DonationItem


}