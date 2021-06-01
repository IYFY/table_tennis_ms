import { request } from './request';
// 商品请求

// 分页请求
export function getMemberswapAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/memberswap/getMemberswapAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
    // headers: {
    //     'Content-Type':'application/json'
    // },
  })
}
// 添加数据请求
export function addMemberswap(data) {


  return request({
    method: 'post',
    url: 'api/memberswap/addMemberswap',
    data: {

      member_id: data.member_id,
      goods_id: data.goods_id,
      swap_count: data.swap_count,
      swap_integration: data.swap_integration,

    }
    // headers: {
    //     'Content-Type':'application/json'
    // },
  })
}
// 更新数据请求
export function updateGoods(data) {

  return request({
    method: 'post',
    url: 'api/goods/updateGoods',
    data: {
      goods_id: data.goods_id,
      goods_name: data.goods_name,
      cats_id: data.cats_id,
      price: data.price,
      goods_stock: data.goods_stock,
      warn_stock: data.warn_stock,
      issale: data.issale,
      isswap: data.isswap,
      swap_stock: data.swap_stock,
      swap_integration: data.swap_integration,

    }
  })
}
// 撤消兑换数据请求
export function cancelMemberswap(data) {
  
  return request({
    method: 'post',
    url: 'api/memberswap/cancelMemberswap',
    data: {
      record_id: data.record_id,
      member_id: data.member_id,
      goods_id: data.goods_id,
      swap_count: data.swap_count,
      swap_integration: data.swap_integration,
    }
  })
}
// 删除数据请求
export function deleteMemberswap(data) {

  return request({
    method: 'post',
    url: 'api/memberswap/deleteMemberswap',
    data: {
      record_id: data.record_id
    }
  })
}


