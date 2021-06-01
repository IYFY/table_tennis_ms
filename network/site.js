import { request } from './request';


// 正常球桌的请求
export function getSiteIdInfo(data) {

  return request({
    method: 'get',
    url: 'api/site/getSiteIdInfo',
   
  
  })
}
// 正常球桌的请求
export function getStartSiteIdInfo(data) {

  return request({
    method: 'get',
    url: 'api/site/getStartSiteIdInfo',
   

  })
}
// 分页请求
export function getSiteAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/site/getSiteAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
 
  })
}
// 添加数据请求
export function addSite(data) {

  return request({
    method: 'post',
    url: 'api/site/addSite',
    data: {
      // member_id: data.member_id,
      table_name: data.table_name,
      site: data.site,
      state: data.state,
    }
   
  })
}
// 更新数据请求
export function updateSite(data) {

  return request({
    method: 'post',
    url: 'api/site/updateSite',
    data: {
      table_id: data.table_id,
      table_name: data.table_name,
      site: data.site,
      state: data.state,
    }
    
  })
}

// 删除数据请求
export function deleteSite(data) {

  return request({
    method: 'post',
    url: 'api/site/deleteSite',
    data: {
      table_id: data.table_id
    }
  
  })
}


