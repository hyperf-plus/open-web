import $http from '@/utils/request';

// 获取已安装应用列表
export const fetchWorkList = (params?: any): Promise<any> => $http.get('/corp/v1/app/list', params);

// 获应用列表
export const fetchUserLabelApps = (params?: any): Promise<any> => $http.get('/corp/v1/user_label_relation/apps', params);

// 获取已安装应用详情
export const fetchWorkAppDetail = (app_id: string): Promise<any> => $http.get(`/corp/v1/app/${app_id}`);

// 更新应用
export const requestWorkAppUpdateConfig = (params?: any): Promise<any> => $http.put('/corp/v1/app/version', params);

// 应用权限配置
export const requestAppPermission = (params?: any): Promise<any> => $http.post('/corp/v1/app_permission/save', params);

// 外部联系人应用权限配置
export const requestThreeAppPermission = (params?: any): Promise<any> => $http.post('/corp/v1/app_permission/three/save', params);

// 获取已有权限的人员
export const fetchAppPerssionList = (permission_id: string): Promise<any> => $http.get(`/corp/v1/app_permission/${permission_id}`);

// 更新应用排序
export const requestWorkAppUpdateSort = (corp_app_id: string | number, params: { sort: any }): Promise<any> => $http.put(`corp/v1/app/sort/${corp_app_id}`, params);