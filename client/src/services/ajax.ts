import axios from "axios";
import { message } from "antd";
const instance = axios.create({
  timeout: 10 * 1000,
});

// 响应拦截器
instance.interceptors.response.use((res) => {
  const resData = (res.data || {}) as ResDataType;
  const { errno, data, msg } = resData;
  if (errno !== 0) {
    // 错误提示
    if (msg) {
      message.error(msg);
    }
    throw new Error(msg);
  }
  return data as any;
});

export default instance;

export type RestType = {
  error: number;
  data?: ResDataType;
  msg?: string;
};

export type ResDataType = {
  [key: string]: any;
};
