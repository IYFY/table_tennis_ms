import { request } from './request';
// 计费规则请求

// 分页请求
export function getRuleAllInfo(data) {

  return request({
    method: 'post',
    url: 'api/chargerule/getRuleAllInfo',
    data: {
      name: data.name,
      pageIndex: data.pageIndex,
      pageSize: data.pageSize
    }
  
  })
}
// 添加数据请求
export function addRule(data) {
 
  return request({
    method: 'post',
    url: 'api/chargerule/addRule',
    data: {
      // member_id: data.member_id,
      rule_name: data.rule_name,
      measure: data.measure,
      price: data.price,
      type: data.type,
      detail: data.detail,
    }
  
  })
}
// 更新数据请求
export function updateRule(data) {

  return request({
    method: 'post',
    url: 'api/chargerule/updateRule',
    data: {
      rule_id: data.rule_id,
      rule_name: data.rule_name,
      measure: data.measure,
      price: data.price,
      type: data.type,
      detail: data.detail,
      isactivate: data.isactivate,

    }
  
  })
}

// 删除数据请求
export function deleteRule(data) {
  
  return request({
    method: 'post',
    url: 'api/chargerule/deleteRule',
    data: {
      rule_id: data.rule_id
    }
  
  })
}

// 请求积分数据请求
export function getPartARule(data) {

  return request({
    method: 'get',
    url: 'api/chargerule/getPartARule',

  
  })
}

// 请求计费数据请求
export function getPartBRule(data) {
 
  return request({
    method: 'get',
    url: 'api/chargerule/getPartBRule',

  })
}


