import axios, { AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-react';

const requestQueue: any[] = []; // 请求队列
const maxConcurrent = 10; // 最大并发请求数
let concurrentRequests = 0; // 当前并发请求数

const request = axios.create({
  // @ts-ignore
  baseURL: import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL,
});

request.interceptors.request.use(
  (config) => {
    config.url = '/api/v1' + config.url;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers['Client-Id'] = window.client_id ?? 'test';
    if (concurrentRequests < maxConcurrent) {
      concurrentRequests++;
      return config;
    } else {
      return new Promise((resolve) => {
        requestQueue.push({
          config,
          resolve,
        });
      });
    }
  },
  (error) => Promise.reject(error)
);

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    config.headers['Accept'] = 'application/json;charset=UTF-8';
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    concurrentRequests--;
    if (requestQueue.length > 0) {
      const { config, resolve } = requestQueue.shift();
      concurrentRequests++;
      resolve(config);
    }
    return response;
  },
  (error) => {
    concurrentRequests--;
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const { config, data, status } = response;
    if (status !== 200) {
      return Promise.resolve(data);
    }
    if (config.url && config.url.indexOf('client/verify') > -1) {
      return {
        XRequestId: response.headers['x-request-id'] || '',
        ...data,
      };
    }
    return data;
  },
  (error) => {
    if (!error.response) {
      console.error('网络请求超时: ', error);
      return Promise.reject(error);
    }
    const { config, status } = error.response;
    const { error: errorMessage, code } = error.response.data;
    if (status === 401 && !config.url.includes('/user/refresh_token')) {
      return request.get('/user/refresh_token').then(async (data) => {
        return request.request(config);
      });
    }
    if (status === 401 && code === 0) {
      localStorage.removeItem('token');
      location.reload();
    }
    if (status === 400) {
      if (code === 403) {
        localStorage.removeItem('token');
      }
      Message.error(errorMessage || '请求错误');
      return Promise.reject(error.response);
    }
    if (status === 422) {
      Message.error(errorMessage || '请求错误');
      return Promise.reject(error.response);
    }
    if (status === 403) {
      Message.error(errorMessage || '无权访问！');
    }
    console.error('网络错误: ', error.response);
    return Promise.reject(error.response);
  }
);

export const get = <T>(url: string, params?: any): Promise<T> => {
  return request
    .get<any, AxiosResponse<T>>(url, { params })
    .then((response) => response.data);
};

export const post = <T>(url: string, data: any): Promise<T> => {
  return request
    .post<any, AxiosResponse<T>>(url, data)
    .then((response) => response.data);
};

export const put = <T>(url: string, data: any): Promise<T> => {
  return request
    .put<any, AxiosResponse<T>>(url, data)
    .then((response) => response.data);
};

export const del = <T>(url: string, data?: any): Promise<T> => {
  return request
    .delete<any, AxiosResponse<T>>(url, { data })
    .then((response) => response.data);
};

export const getToken = () => localStorage.getItem('token');

export default request;
