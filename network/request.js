import axios from 'axios';
import router from '../src/router';
import Vue from 'vue';

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000
  })
  //请求(成功、失败)拦截
  instance.interceptors.request.use(config => {
    //vuex的方式
    // console.log(" store    jwt: " + store.getters.currentUser.usertoken)
    // if (store.getters.currentUser.usertoken) {

    //   // config.headers['X-Token'] = getToken()
    //   // 因为是jwt方式鉴权 所以在header头中改为如下写法
    //   // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // 本地存储方式取出
    let token = localStorage.getItem('currentUser_token')
   
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;  //将token设置成请求头
      // config.headers['X-Token'] = getToken()
      // 因为是jwt方式鉴权 所以在header头中改为如下写法
      // config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  }, err => {

  })
  // 响应(成功、失败)拦截
  instance.interceptors.response.use(res => {
   
    if (res.data.message == '登陆过期，请重新登陆') {

      localStorage.removeItem('admin_id');
      localStorage.removeItem('admin_name');
      localStorage.removeItem('gender');
      localStorage.removeItem('phone');
      localStorage.removeItem('currentUser_token');
      Vue.prototype.$message.error(res.data.message);
      router.push('/');
    }

    return res.data;
  }, err => {
    console.log(err);
  })

  return instance(config);
}
