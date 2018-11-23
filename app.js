var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var axios = require('axios')
var fs = require('fs')
var dayjs = require('dayjs')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var apiRouter = require('./routes/api')
var token = require('./storage/token.json')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// refresh tokens every 10 minutes
var jikeTokenRefreshUrl = 'https://app.jike.ruguoapp.com/app_auth_tokens.refresh'
var refreshRate = 10 * 60 * 1e3

function refreshTokens () {
  console.log('[INFO] Started background task: refresh tokens...')
  setInterval(function () {
    axios({
      method: 'GET',
      url: jikeTokenRefreshUrl,
      headers: {
        'x-jike-refresh-token': token.refreshToken
      }
    }).then(function (response) {
      var refreshToken = response.data['x-jike-refresh-token']
      var accessToken = response.data['x-jike-access-token']
      var refreshTimestamp = dayjs().format('{YYYY-MM-DD} HH:mm:ss')
      var tokenData = {
        'refreshToken': refreshToken,
        'accessToken': accessToken,
        'refreshTimestamp': refreshTimestamp
      }
      fs.writeFile('./storage/token.json', JSON.stringify(tokenData), function (err) {
        // err
        if (err) throw err
      })
      console.log('[INFO] Refreshed! At time: ' + refreshTimestamp)
    }).catch(function (error) {
      console.log('[ERR!] ' + error)
    })
  }, refreshRate)
}

refreshTokens()

module.exports = app
