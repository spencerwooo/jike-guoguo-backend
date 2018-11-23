var express = require('express')
var axios = require('axios')
var router = express.Router()
var token = require('../storage/token.js')

var status = {
  ok: 'ok',
  err: 'error'
}

var jikeAccessToken = token.token.accessToken
var jikeApiRootUrl = 'https://app.jike.ruguoapp.com/1.0/users/profile?username='

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

router.get('/', function (req, res) {
  res.json(status.ok)
})

router.get('/username/:jikeUUID', function (req, res) {
  var username = req.params.jikeUUID
  // res.json(req.params)

  axios({
    method: 'GET',
    url: jikeApiRootUrl + username,
    headers: {
      'x-jike-access-token': jikeAccessToken
    }
  }).then(function (response) {
    // console.log(response.data)
    var userInfo = response.data.user
    var user = {
      screenName: userInfo.screenName,
      bio: userInfo.bio,
      isVerified: userInfo.isVerified,
      verifyMessage: userInfo.verifyMessage,
      avatarImage: userInfo.avatarImage.smallPicUrl,
      statsCount: {
        followed: userInfo.statsCount.followedCount,
        following: userInfo.statsCount.followingCount
      },
      createdTime: userInfo.createdAt
      // playgrounds: ['', '', '']
    }
    res.json(user)
  }).catch(function (error) {
    console.log(error)
    res.send(status.err)
  })
})

module.exports = router
