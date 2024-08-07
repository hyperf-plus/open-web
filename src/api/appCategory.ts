import $http from '@/utils/request';
export const systemApplist = (params?: any): Promise<any> => $http.get(`/corp/v1/app_cate/list`, params)
export const systemAppCreate = (params?: any): Promise<any> => $http.post(`/corp/v1/app_cate/create`, params)
export const systemAppPut = (cate_id, params): Promise<any> => $http.put(`/corp/v1/app_cate/${cate_id}`, params)
export const systemAppDel = (cate_id, params): Promise<any> => $http.delete(`/corp/v1/app_cate/${cate_id}`, params)
