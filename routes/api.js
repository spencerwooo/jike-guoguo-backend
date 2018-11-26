var express = require('express')
var axios = require('axios')
var dayjs = require('dayjs')
var fs = require('fs')

var router = express.Router()

var status = {
  ok: 'Ok',
  searchError: 'Search API Error',
  userinfoError: 'Get User Info Error'
}

var jikeApiRootUrl = 'https://app.jike.ruguoapp.com/1.0/users/profile?username='
var jikeApiSearchUrl = 'https://app.jike.ruguoapp.com/1.0/users/searchUser'

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

router.get('/', function (req, res) {
  res.json(status.ok)
})

router.get('/jike', function (req, res) {
  res.json(status.ok)
})

router.get('/jike/:username', function (req, res) {
  fs.readFile('./storage/token.json', function read (err, data) {
    if (err) throw err
    var token = JSON.parse(data)

    var username = req.params.username
    var jikeAccessToken = token.token.accessToken
    // res.json(req.params)

    // Get user uuid via search API by searching username
    axios({
      method: 'POST',
      url: jikeApiSearchUrl,
      headers: {
        'x-jike-access-token': jikeAccessToken
      },
      data: {
        keywords: username,
        limit: 2,
        loadMoreKey: null
      }
    }).then(function (response) {
    // Gets user uuid
      var useruuid = response.data.data[0].username

      // Get user detailed info via uuid
      axios({
        method: 'GET',
        url: jikeApiRootUrl + useruuid,
        headers: {
          'x-jike-access-token': jikeAccessToken
        }
      }).then(function (response) {
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
          username: userInfo.username,
          screenName: userInfo.screenName,
          bio: bio,
          isVerified: userInfo.isVerified,
          verifyMessage: userInfo.verifyMessage,
          verifyIcon: 'https://cdn.ruguoapp.com/jike-web/static/images/verified.6e5b91e.svg',
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
      }).catch(function (err) {
        res.send(status.userinfoError)
        throw err
      })
    }).catch(function (err) {
      res.send(status.searchError)
      throw err
    })
  })
})

module.exports = router
