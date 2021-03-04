export class CookieHelper {
  static setCookie(name, value, hour = 0.1, domain = "") {
/*    var date = new Date();
    date.setTime(date.getTime() + hour * 60 * 60 * 1000);
    let cookie =
      name + "=" + escape(value) + ";path=/;expires=" + date.toGMTString();
    if (domain) {
      cookie = cookie + ";domain=" + domain + "; SameSite=Lax";
    }
    document.cookie = cookie;*/
  }

  static getCookie(name) {
/*    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2]);
    }
    return null;*/
  }
}
