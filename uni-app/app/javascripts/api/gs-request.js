/**
 * Created by TY-xie on 2018/4/2.
 */
/* import axios from "axios";
window.axios = axios;
import _ from "../modules/dialog";
import { getParams } from "libs/libs";

// 请求之前的拦截器
axios.interceptors.request.use(
  config => {
    console.log(config, "请求");
    let bid = getParams().bid;
    if (!config.params) {
      config.params = { bid };
    } else if (!config.params["bid"]) {
      config.params["bid"] = bid;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 请求之后的拦截器
axios.interceptors.response.use((response) => {
  if(response.status===300) {
	window.location.href = 'https://h5.yunhuiyuan.cn/429.html'
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default function request(
  { method = "post", data, url, header = {} },
  loading = true
) {
  console.log("request ------ ", url);
  return new Promise((resolve, reject) => {
    loading && _._loading();
    let params = null;
    if (data.params) {
      params = data.params;
      delete data.params;
    }
    console.log(method);
    axios({
      method,
      url,
      data,
      params,
      header
    })
      .then(res => {
        loading && _._unLoading();
        // axios的res为其封装对象,后端返回的response放在它的data�
        // 在此对于请求失败以及操作失败,对于调用对象均返回success为false,返回错误及后端res
        // 对于操作成功,返回success为true,后端res带有data�直接返回其data,否则返回后端res
        if (!res.data.success && !res.data.Success) {
          resolve({
            success: false,
            message: res.data.message || "后端操作失败!",
            data: res.data, // 后端操作失败返回完整res
            res: res.data
          });
        } else {
          resolve({
            success: true,
            message: res.data.message || "请求成功!",
            data: res.data.data || res.data,
            res: res.data
          });
        }
      })
      .catch(err => {
        console.log(err);
        loading && _._loading();
        _._toast("网络故障!", 1);
        resolve({
          success: false,
          message: "网络故障",
          data: err,
          res: {}
        });
      });
  });
}
 */

export default function request() {
	return Promise.resolve({success: false})
}
