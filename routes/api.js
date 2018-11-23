var express = require('express')
var axios = require('axios')
var dayjs = require('dayjs')

var token = require('../storage/token.json')

var router = express.Router()

var status = {
  ok: 'ok',
  err: 'error'
}

var jikeAccessToken = token['accessToken']
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
    // userInfo: Returns all user data
    var userInfo = response.data.user

    // Get register time to today (In days)
    var createdTime = userInfo.createdAt
    var currentTime = dayjs()
    var registerTime = currentTime.diff(createdTime, 'day')

    // Replace bio's '\n' with '<br>' for frontend
    var bio = userInfo.bio.replace(/\n/g, '<br>')

    // user: Send required user data in response
    var user = {
      screenName: userInfo.screenName,
      bio: bio,
      isVerified: userInfo.isVerified,
      verifyMessage: userInfo.verifyMessage,
      medals: userInfo.medals,
      avatarImage: userInfo.avatarImage.smallPicUrl,
      statsCount: {
        followed: userInfo.statsCount.followedCount,
        following: userInfo.statsCount.followingCount
      },
      registerTime: registerTime
      // playgrounds: ['', '', '']
    }
    res.json(user)
  }).catch(function (error) {
    res.send(status.err)
    throw error
  })
})

module.exports = router
