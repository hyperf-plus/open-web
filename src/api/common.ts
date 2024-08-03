import { get, post } from '@/utils/request';

// 定义 API 响应类型
export interface ConfigResponse {
  CORP_INDUSTRY: string[];
  CORP_SCALE: string[];
  CORP_USER_TYPE: string[];
  SYSTEM_SEX: string[];
}

export const config = (params?: any): Promise<ConfigResponse[]> => {
  return get('/corp/v1/common/config', { params });
};

export const sendSms = (params: any) => {
  return post('/corp/v1/common/send_sms', params);
};

export const upload = (params: any) => {
  return post('/corp/v1/common/upload', params);
};

export const initJssdk = (url: string) => {
  return get(`/corp/v1/jssdk/config?url=${url}`);
};
