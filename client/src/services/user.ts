import axios, { ResDataType } from "./ajax";

// 获取用户信息
export async function getUserInfoService(): Promise<ResDataType> {
  const url = "/api/user/info";
  const data = (await axios.get(url)) as ResDataType;
  return data;
}

// 注册
export async function registerService(
  username: string,
  password: string,
  nickname?: string //设置昵称也可以不填写
): Promise<ResDataType> {
  const url = "/api/user/register";
  const mainInfo = { username, password, nickname: nickname || username }; //这里如果nickname没填写，可以用username来代替
  const data = (await axios.post(url, mainInfo)) as ResDataType;
  return data;
}

// 登录
export async function loginService(
  username: string,
  password: string
): Promise<ResDataType> {
  const url = "/api/user/login";
  const mainInfo = { username, password };
  const data = (await axios.post(url, mainInfo)) as ResDataType;
  return data;
}
