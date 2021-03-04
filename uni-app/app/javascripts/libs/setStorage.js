/**
 * Created by TY-xie on 2017/10/13.
 */
const ls = window.sessionStorage;
export default {
  getItem(key) {
    try {
      return JSON.parse(ls.getItem(key));
    } catch (err) {
      return null;
    }
  },
  setItem(key, val) {
    ls.removeItem(key);
    ls.setItem(key, JSON.stringify(val));
  },
  clear() {
    ls.clear();
  },
  keys() {
    return ls.keys();
  },
  removeItem(key) {
    ls.removeItem(key);
  }
};
