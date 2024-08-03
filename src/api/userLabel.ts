import { get, post, put, del } from '@/utils/request';

// 定义 API 响应类型
export interface UserLabel {
  corp_user_label_id: number;
  name: string;
  id: number;
  avatar: string;
  department: boolean;
  select_status: boolean;
}

export interface UserLabelListResponse {
  items: UserLabel[];
}

export const labelList = (params?: any): Promise<UserLabelListResponse> => {
  return get<UserLabelListResponse>('/corp/v1/corp_user_label/list', {
    params,
  });
};

export const labelCreate = (params: any) => {
  return post('/corp/v1/corp_user_label/create', params);
};

export const labelDelete = (id: number) => {
  return del(`/corp/v1/corp_user_label/${id}`);
};

export const labelPut = (id: number, params: any) => {
  return put(`/corp/v1/corp_user_label/${id}`, params);
};

export const labelMemberCreate = (params: any) => {
  return post('/corp/v1/corp_user_label_member/create', params);
};

export const labelMemberDelete = (params: any) => {
  return del('/corp/v1/corp_user_label_member/delete', { data: params });
};

export const labelMemberList = (corp_user_label_id: number, params: any) => {
  return get(`/corp/v1/corp_user_label_member/list/${corp_user_label_id}`, {
    params,
  });
};
