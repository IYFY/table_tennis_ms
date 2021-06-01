import { request } from './request';

// 分页请求
export function getAdminAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/admin/getAdminAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
    
  })
}

// 添加数据请求
export function addAdmin(data) {
 
  return request({
    method: 'post',
    url: 'api/admin/addAdmin',
    data: {
      // member_id: data.member_id,
      admin_name: data.admin_name,
      gender: data.gender,
      phone: data.phone,
      password: data.password,
    }
    // headers: {
    //     'Content-Type':'application/json'
    // },
  })
}

// 更新数据请求
export function updateAdmin(data) {

  return request({
    method: 'post',
    url: 'api/admin/updateAdmin',
    data: {
      admin_id: data.admin_id,
      admin_name: data.admin_name,
      gender: data.gender,
      phone: data.phone,
      password: data.password,
    }
    // headers: {
    //     'Content-Type':'application/json'
    // },
  })
}

// 删除数据请求
export function deleteAdmin(data) {

  return request({
    method: 'post',
    url: 'api/admin/deleteAdmin',
    data: {
      admin_id: data.admin_id,
  
    }
   
  })
}




// 登录请求
export function login(username, password) {
  // console.log(data)
  return request({
    method: 'post',
    url: 'api/admin/login',
    data: {
      phone: username,
      password: password,
    }
   
  })
}

// 修改密码请求
export function updatePassword(data) {
 
  return request({
    method: 'post',
    url: 'api/admin/updatePassword',
    data: {
      admin_id: data.admin_id,
      password: data.password,
      newpwd: data.newpwd,
    }
  
  })
}
