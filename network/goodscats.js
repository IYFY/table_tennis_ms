import { request } from './request';
// 商品分类请求

// 分页请求
export function getGoodscatsAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/goodscats/getGoodscatsAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
   
  })
}
// 添加数据请求
export function addGoodscats(data) {
 
  return request({
    method: 'post',
    url: 'api/goodscats/addGoodscats',
    data: {
   
      cats_name: data.cats_name,
    }
 
  })
}
// 更新数据请求
export function updateGoodscats(data) {

  return request({
    method: 'post',
    url: 'api/goodscats/updateGoodscats',
    data: {
      cats_id: data.cats_id,
      cats_name: data.cats_name,

    }
 
  })
}

// 删除数据请求
export function deleteGoodscats(data) {

  return request({
    method: 'post',
    url: 'api/goodscats/deleteGoodscats',
    data: {
      cats_id: data.cats_id
    }

  })
}

// 请求分类id name数据请求
export function getPartGoodscats(data) {

  return request({
    method: 'get',
    url: 'api/goodscats/getPartGoodscats',

   
  })
}


