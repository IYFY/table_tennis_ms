import { request } from './request';
// 商品请求

// 分页请求
export function getSpendinggoodsAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/spendinggoods/getSpendinggoodsAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
   
  })
}
// 添加数据请求
export function addSpendinggoods(data) {
  
  return request({
    method: 'post',
    url: 'api/spendinggoods/addSpendinggoods',
    data: {
      bill_code: data.bill_code,
      goods_id: data.goods_id,
      goods_count: data.goods_count,
      amount: data.amount,
    }
   
  })
}


// 撤消 购买商品 数据请求
export function cancelgoods(data) {
  
  return request({
    method: 'post',
    url: 'api/spendinggoods/cancelgoods',
    data: {
      goods_bill: data.goods_bill,
      // bill_code: data.bill_code,
      goods_id: data.goods_id,
      goods_count: data.goods_count,
    }
  })
}

// 更新数据请求
export function updateSpendinggoods(data) {

  return request({
    method: 'post',
    url: 'api/spendinggoods/updateSpendinggoods',
    data: {
      bill_code: data.bill_code,
      goods_id: data.goods_id,
      goods_count: data.goods_count,

    }
  })
}
// 删除数据请求
export function deleteSpendinggoods(data) {

  return request({
    method: 'post',
    url: 'api/spendinggoods/deleteSpendinggoods',
    data: {
      goods_bill: data.goods_bill
    }
  })
}


// 可某个编码的商品
export function getSpendinggoodsInfo(data) {
  
  

  return request({
    method: 'post',
    url: 'api/spendinggoods/getSpendinggoodsInfo',
    data: {
      bill_code: data.bill_code
    }
  })
}
