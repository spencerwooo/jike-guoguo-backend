var express = require('express')
var router = express.Router()

var response = {
  status: 'ok',
  uuid: '10.0.0.55'
}

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

router.get('/', function (req, res, next) {
  res.json(response)
})

module.exports = router
