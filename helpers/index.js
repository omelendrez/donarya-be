module.exports.throwErr = (err_message) => {
  throw new Error(err_message)
}

module.exports.noProps = {
  password: undefined,
  address: undefined,
  phone: undefined,
  dni: undefined,
  createdAt: undefined,
  updatedAt: undefined
}