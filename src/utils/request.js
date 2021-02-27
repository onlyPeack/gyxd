import axios from 'axios'
import {
  Message,
  MessageBox,
  Notification
} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

//声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let pending = [];
let cancelToken = axios.CancelToken;
let removePending = (config) => {
  for (var p = pending.length - 1; p >= 0; p--) {
    if (pending[p].url == config.url) {
      pending[p].cancel('cancelToken');//执行取消操作,并返回指定的响应
      pending.splice(p, 1);//把此条记录移除
    }
  }
};

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = getToken(); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    } else {
      config.headers.Authorization = 'Basic dnVlOnZ1ZQ=='; // 增加客户端认证
    }

    // do something before request is sent

    // if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
    if (response.status !== 200 && res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug

    //判断是否为取消请求的指定响应
    if (error.message == 'cancelToken') {
      return;
    }

    const response = error.response
    if (response === undefined) {
      Message({
        message: '服务请求超时！',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    if (response.status === 400) {
      if (response.data.error == 'invalid_grant') {
        Message({
          message: '账户或密码错误！',
          type: 'warning'
        })
      } else {
        Message({
          message: '服务请求出错！',
          type: 'warning'
        })
      }
      return Promise.reject('error')
    }
    const info = response.data
    if (response.status === 401 && response.data.error == 'unauthorized') {
      Message({
        message: '账户或密码错误！',
        type: 'warning'
      })
      return Promise.reject('error')
    }
    if (response.status === 401 && info.status === 40101) {
      /* if(location.hash=='#/login'){
        return
      }*/

      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // Communication.$emit('openDialog');
        store.dispatch('user/LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {
        return
      })
      return;
    }
    if (response.status === 401 && info.status === 40001) {
      Notification.warning({
        title: '禁止',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }
    if (response.status === 403) {
      Notification.warning({
        title: '禁止',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }
    if (info.status === 30101) {
      Notification.warning({
        title: '失败',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }
    if (response.status === 504) {
      Message({
        message: '后端服务异常，请联系管理员！',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    var msg = info.message ? info.message : info.msg;
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
