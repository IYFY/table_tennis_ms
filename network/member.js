import { request } from './request';


// 分页请求
export function getMemberAllInfo(data) {
  
  return request({
    method: 'post',
    url: 'api/member/getMemberAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
 
  })
}

// 添加数据请求
export function addMember(data) {

  return request({
    method: 'post',
    url: 'api/member/addMember',
    data: {
      // member_id: data.member_id,
      name: data.name,
      gender: data.gender,
      age: data.age,
      phone: data.phone,
      balance: data.balance,
      integration: data.integration
    }
   
  })
}

// 更新数据请求
export function updateMember(data) {

  return request({
    method: 'post',
    url: 'api/member/updateMember',
    data: {
      member_id: data.member_id,
      name: data.name,
      gender: data.gender,
      age: data.age,
      phone: data.phone,
      balance: data.balance,
      integration: data.integration
    }
   
  })
}

// 删除数据请求
export function deleteMember(data) {

  return request({
    method: 'post',
    url: 'api/member/deleteMember',
    data: {
      member_id: data.member_id,

    }
  

  })
}


// 全部顾客的id， name， 积分的请求
export function getMemberIdInfo(data) {

  return request({
    method: 'get',
    url: 'api/member/getMemberIdInfo',
   
  })
}

