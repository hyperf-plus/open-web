import { get, post, put, del } from '@/utils/request';

export interface Contact {
  id: number;
  name: string;
  avatar: string;
  department: boolean;
  select_status: boolean;
}

export const search = (params?: any): Promise<Contact[]> => {
  return get<Contact[]>('/corp/v1/contact/search', { params });
};

export const corpSearch = (params?: any): Promise<Contact[]> => {
  return get<Contact[]>('/corp/v1/contact/corp_search', { params });
};

export const contactEnum = (params: any) => {
  return post('/corp/v1/contact/enum', params);
};

export const list = (params?: any): Promise<Contact[]> => {
  return get<Contact[]>('/corp/v1/contact/list', { params });
};

export const getCorpList = (params?: any): Promise<Contact[]> => {
  return get<Contact[]>('/corp/v1/contact/corp_list', { params });
};
