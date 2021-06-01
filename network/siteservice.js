import { request } from './request';
// 维护请求

// 分页请求
export function getSiteserviceInfo(data) {

  return request({
    method: 'post',
    url: 'api/siteservice/getSiteserviceInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
    
  })
}
// 添加数据请求
export function addSiteservice(data) {

  return request({
    method: 'post',
    url: 'api/siteservice/addSiteservice',
    data: {
      // member_id: data.member_id,
      table_id: data.table_id,
      details: data.details,
    }
    
  })
}
// 更新数据请求
export function updateSiteservice(data) {
  
  return request({
    method: 'post',
    url: 'api/siteservice/updateSiteservice',
    data: {
      service_id: data.service_id,
      table_id: data.table_id,
    }
 
  })
}

// 删除数据请求
export function deleteSiteservice(data) {
 
  return request({
    method: 'post',
    url: 'api/siteservice/deleteSiteservice',
    data: {
      service_id: data.service_id
    }
  
  })
}


