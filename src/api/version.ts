import { get, post, put } from '@/utils/request';

// 创建版本
export function createOaVersionCreate(params: any) {
  return post('/open/v1/version/create', params);
}

// 获取应用的版本列表
export function getOaVersionList(params?: any) {
  return get('/open/v1/version/list', { params });
}

// 获取应用的版本详情
export function getOaVersionDetail(id: number) {
  return get(`/open/v1/version/${id}`);
}

// 更新应用的版本详情
export function updateOaVersionDetail(id: number, params: any) {
  return put(`/open/v1/version/${id}`, params);
}

// 发布应用版本
export function doPublishVersion(id: number, params: any) {
  return put(`/open/v1/version/version/${id}`, params);
}

// 申请发布详情
export function publishDetail(system_app_id: number) {
  return get(`/open/v1/version/publish/${system_app_id}`);
}

// 获取当前版本详情
export function getVersionDetail(system_app_id: number) {
  return get(`/open/v1/version/curren/${system_app_id}`);
}
