const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const pe = require('parse-error')

const v1 = require('./routes/v1')
const app = express()

const CONFIG = require('./config')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const models = require('./models')
models.sequelize.authenticate().then(() => {
  console.log('Connected to SQL database:', CONFIG.db_name)
})
  .catch(err => {
    console.error('Unable to connect to SQL database:', CONFIG.db_name, err)
  })

if (CONFIG.app === 'dev') {
  models.sequelize.sync({ force: false }) //creates table if they do not already exist
  // models.sequelize.sync({ force: true });//deletes all tables then recreates them useful for testing and development purposes
}

app.use('/', v1)
app.use('/', function (req, res) {
  res.statusCode = 422
  res.json({ success: false, error: 'Endpoint not found', data: {} })
})
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.json({
    message: err.message,
    error: err
  });
})

module.exports = app

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error))
})

