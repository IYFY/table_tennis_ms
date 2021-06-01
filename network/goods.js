import { request } from './request';
// 商品请求

// 分页请求
export function getGoodsAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/goods/getGoodsAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
 
  })
}
// 添加数据请求
export function addGoods(data) {

  return request({
    method: 'post',
    url: 'api/goods/addGoods',
    data: {
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
// 删除数据请求
export function deleteGoods(data) {

  return request({
    method: 'post',
    url: 'api/goods/deleteGoods',
    data: {
      goods_id: data.goods_id
    }
  })
}


// 可兑换的商品的请求
export function getGoodsswpaInfo(data) {

  return request({
    method: 'get',
    url: 'api/goods/getGoodsswpaInfo',
   
  })
}

// 可购买的商品的请求
export function getGoodssaleInfo(data) {

  return request({
    method: 'get',
    url: 'api/goods/getGoodssaleInfo',
   
  })
}
