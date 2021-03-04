export default {
  methods: {
    checkImage(url) {
      if (!ISDEV && url) {
        let cdnUrl = 'https://cdn.m.yunhuiyuan.cn'
        var index = url.indexOf('/static/pictures/')
        if (index === 0) {
          var imageUrl = cdnUrl + url
          return imageUrl
        }
        else {
          return url
        }
      } else {
        return url
      }
    }
  }
}