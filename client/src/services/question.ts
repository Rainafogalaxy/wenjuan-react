import axios from "./ajax";
import type { ResDataType } from "./ajax";

type SearchOption = {
  keyword: string;
  isStar: boolean;
  isDeleted: boolean;
  page: Number; //一共有多少页         服务端根据这两个数据来决定如何返回数据
  pageSize: Number; //每页有多少条
  // ...
};

// 获取单个问卷信息
export async function getQuestionService(id: string): Promise<ResDataType> {
  const url = `/api/question/${id}`;
  const data = (await axios.get(url)) as ResDataType;
  return data;
}

// 创建问卷
export async function createQuestionService(): Promise<ResDataType> {
  const url = "/api/question";
  const data = (await axios.post(url)) as ResDataType;
  return data;
}

// 获取(查询)问卷列表
export async function getQuestionListService(
  // 这里的Partial意思是定义的SearchOption类型的一部分
  opt: Partial<SearchOption> = {}
): Promise<ResDataType> {
  const url = "/api/question";
  const data = (await axios.get(url, { params: opt })) as ResDataType;
  return data;
}
