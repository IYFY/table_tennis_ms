import {request} from './request';

export function getstaff(sname, spwd) {

    return request({
        method: 'post',
        url: 'api/user/login',
        data: {
          username: sname,
          password: spwd
        }
    })
}
export function getuser(sname, spwd) {

    return request({
        method: 'post',
        url: '/api/user',
       
        data: {
          username: sname,
          password: spwd
        }
    })
}
