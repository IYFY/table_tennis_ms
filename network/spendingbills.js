import { request } from './request';
// 消费请求

// 分页请求
export function getSpendingbillAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/spendingbills/getSpendingbillAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
  
  })
}
// 添加数据请求
export function addSpendingbill(data) {
  
  return request({
    method: 'post',
    url: 'api/spendingbills/addSpendingbill',
    data: {

      member_id: data.member_id,
      operator: data.admin_id,

    }
  })
}
// 添加账单和球桌消费数据请求
export function addbillandtable(data) {

  return request({
    method: 'post',
    url: 'api/spendingbills/addbillandtable',
    data: {

      member_id: data.member_id,
      table_id: data.table_id,
      operator: data.admin_id,
      reserve_id: data.reserve_id,
      reserve_state: data.reserve_state,

      // member_id: data.member_id,
      // reserve_time: data.reserve_time,
      // reserve_duration: data.reserve_duration,
      // reserve_state: data.reserve_state,
    }
  })
}
// 更新数据请求
export function updateSpendingbill(data) {

  return request({
    method: 'post',
    url: 'api/spendingbills/updateSpendingbill',
    data: {

      bill_code: data.billcode,
      member_id: data.memberid,
      gross_amount: data.amount,
      gain_integration: data.jifen,
    }
  })
}

// 删除数据请求
export function deleteSpendingbill(data) {

  return request({
    method: 'post',
    url: 'api/spendingbills/deleteSpendingbill',
    data: {
      bill_code: data.bill_code
    }
  })
}


