import { request } from './request';
// 商品请求

// 分页请求
export function getSpendingtableAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/spendingtable/getSpendingtableAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
  
  })
}
// 添加数据请求
export function addSpendingtable(data) {
 
  return request({
    method: 'post',
    url: 'api/spendingtable/addSpendingtable',
    data: {
      bill_code: data.bill_code,
      table_id: data.table_id,
    }
 
  })
}
// 更新 时间  数据请求
export function updatetimeSpendingtable(data) {

  return request({
    method: 'post',
    url: 'api/spendingtable/updatetimeSpendingtable',
    data: {
      table_bill: data.table_bill,
      bill_code: data.table_id,
      table_id: data.table_id,
      // end_time: data.end_time,
      duration: data.duration,
      amount: data.amount,
      ruleid: data.ruleid

    }
  })
}
// 删除数据请求
export function deleteSpendingtable(data) {

  return request({
    method: 'post',
    url: 'api/spendingtable/deleteSpendingtable',
    data: {
      table_bill: data.table_bill
    }
  })
}


// 查询某个球桌
export function getSpendingtableInfo(data) {


  return request({
    method: 'post',
    url: 'api/spendingtable/getSpendingtableInfo',
    data: {
      bill_code: data.bill_code
    }
  })
}
