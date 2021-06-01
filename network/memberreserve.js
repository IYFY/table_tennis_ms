import { request } from './request';
// 商品请求

// 分页请求
export function getMemberreserveAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/memberreserve/getMemberreserveAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }

  })
}
// 添加数据请求
export function addMemberreserve(data) {

  return request({
    method: 'post',
    url: 'api/memberreserve/addMemberreserve',
    data: {

      member_id: data.member_id,
      table_id: data.table_id,
      reserve_time: data.reserve_time,
   

    }
    
  })
}

// 撤消兑换数据请求
export function updateMemberreserve(data) {

  return request({
    method: 'post',
    url: 'api/memberreserve/updateMemberreserve',
    data: {
      
      reserve_id: data.reserve_id,
      reserve_state: data.reserve_state,
    }
  })
}
// 删除数据请求
export function deleteMemberreserve(data) {

  return request({
    method: 'post',
    url: 'api/memberreserve/deleteMemberreserve',
    data: {
      reserve_id: data.reserve_id
    }
  })
}


// 返回某个球桌的预约信息
export function getTablereserveInfo(data) {

  return request({
    method: 'post',
    url: 'api/memberreserve/getTablereserveInfo',
    data: {
      table_id: data
    }
  
  })
}
