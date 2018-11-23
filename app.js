var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var axios = require('axios')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var apiRouter = require('./routes/api')
var token = require('./storage/token.js')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
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
var refreshRate = 10 * 60 * 1000

function refreshTokens () {
  console.log('Started background task: refresh tokens...')
  setInterval(function () {
    axios({
      method: 'GET',
      url: jikeTokenRefreshUrl,
      headers: {
        'x-jike-refresh-token': token.token.refreshToken
      }
    }).then(function (response) {
      console.log(response.data)
    }).catch(function (error) {
      console.log(error)
    })
  }, refreshRate)
}

refreshTokens()

module.exports = app
