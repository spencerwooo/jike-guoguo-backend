# Jike GuoGuo Badge Backend API

> Built with Express.js.

🚧 Under construction. 

## Local Dev-server Build Setup

``` bash
# Install dependencies
$ yarn install

# Run dev server, listens at port 3000
$ yarn start
```

## API Usage

### Access API straight from your browser:

```
$ http://localhost:3000/api
```

### Or make a GET request:

**API landing page:**

``` bash
$ curl http://localhost:3000/api
```

**Detailed example:**

``` bash
# Me! @SpencerWoo 
$ curl http://localhost:3000/api/username/4DDA0425-FB41-4188-89E4-952CA15E3C5E

# 栈堆老师，目前见到唯二非 UUID 用户名
$ curl http://localhost:3000/api/username/hoter 
```

## Response payload demo

### Request:

`http://localhost:3000/api/username/4DDA0425-FB41-4188-89E4-952CA15E3C5E`

### Response:

```json
{
  "screenName": "SpencerWoo",
  "bio": "Ⓙ瓦恁 等五百万人关注了他 ➭<br>一手键盘⌨️ / 一支相机📷 / 一把猫毛🐱",
  "isVerified": true,
  "verifyMessage": "编程话题优秀贡献者",
  "medals": ["..."],
  "avatarImage": "https://cdn.ruguoapp.com/FtuW2cr-elNtq2O4EMQ1EZJFb4Pw.jpg?imageView2/0/w/300/h/300/q/100!",
  "statsCount": {
    "followed": 1418,
    "following": 367
  },
  "registerTime": 564
}
```

![](https://i.loli.net/2018/11/24/5bf948f010737.png)

### Response explanation:

1. `screenName`, `bio`, `avatarImage`, `statsCount`: Are all straight requested from Jike's API.
2. `isVerified`, `verifyMessage`: If user is verified, we use verify message as "user intro".
3. `medals`: If user isn't verified, we tend to choose the first medal acquired by the user. If none is applicable, we choose 'Jike Partners' label as "user intro".
4. `registerTime`: Total time from account's first register time up to now, in days. Calculated.

# Disclaimer

- This API is built for personal usage, and for personal usage only.
- This API is not in any relationship with Jike or its affiliated cooperations.
- 果果大法好，默念果大王保平安。喵~

---

🐱 **Jike GuoGuo Name Badge** ©Spencer Woo. Released under the [MIT](https://github.com/spencerwooo/jike-guoguo-badge/blob/master/LICENSE) License. Name badge designs are released under the [CC BY-NC-SA 4.0 License.](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Authored and maintained by Spencer Woo. Co-designed by [ⒿTH3EE](https://web.okjike.com/user/E0BBAACD-3991-49E3-916C-6A67430380A7).

[@Blog](https://spencerwoo.com/) · [ⒿJike](https://web.okjike.com/user/4DDA0425-FB41-4188-89E4-952CA15E3C5E/post) · [@GitHub](https://github.com/spencerwooo)
