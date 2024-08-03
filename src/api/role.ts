import { get, post, put, del } from '@/utils/request';

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export const list = (params?: any): Promise<Role[]> => {
  return get<Role[]>('/corp/v1/role/administrator/list', { params });
};

export const searchUsers = (params?: any): Promise<Role[]> => {
  return get<Role[]>('/corp/v1/role/search_users', { params });
};

export const permissions = (params?: any): Promise<string[]> => {
  return get<string[]>('/corp/v1/role/permissions', { params });
};

export const permissionsList = (params?: any): Promise<string[]> => {
  return get<string[]>('/corp/v1/role/permissions/list', { params });
};

export const create = (params: any) => {
  return post('/corp/v1/role/create', params);
};

export const createAdmin = (params: any) => {
  return post('/corp/v1/role/administrator/create', params);
};

export const roleList = (params?: any): Promise<Role[]> => {
  return get<Role[]>('/corp/v1/role/list', { params });
};

export const tree = (id: number): Promise<Role> => {
  return get<Role>(`/corp/v1/role/tree/${id}`);
};

export const detail = (id: number): Promise<Role> => {
  return get<Role>(`/corp/v1/role/administrator/${id}`);
};

export const editAdmin = (employees_id: number, params: any) => {
  return put(`/corp/v1/role/administrator/${employees_id}`, params);
};

export const deleteAdmin = (employees_id: number) => {
  return del(`/corp/v1/role/administrator/${employees_id}`);
};

export const edit = (role_id: number, params: any) => {
  return put(`/corp/v1/role/${role_id}`, params);
};

export const deleteRole = (role_id: number) => {
  return del(`/corp/v1/role/${role_id}`);
};

export const menus = (params?: any): Promise<any[]> => {
  return get<any[]>('/corp/v1/role/menus', { params });
};
