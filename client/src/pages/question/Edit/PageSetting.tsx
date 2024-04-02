import React, { FC, useEffect } from "react";
import useGetPageInfo from "../../../hooks/useGetPageInfo";
import { Form, Input } from "antd";
import { resetPageInfo } from "../../../store/PageInfoReducer";
import { useDispatch } from "react-redux";
const { TextArea } = Input;
const PageSetting: FC = () => {
  const dispathch = useDispatch();
  const pageInfo = useGetPageInfo();
  // const { title, desc, js, css } = pageInfo;
  const [form] = Form.useForm();
  // 当pageInfo变化时，实时更新表单的内容
  useEffect(() => {
    form.setFieldsValue(pageInfo);
  }, [pageInfo]);
  const handleValuesChange = () => {
    // 在这里设置pageInfo的信息
    // console.log("values", form.getFieldsValue());
    dispathch(resetPageInfo(form.getFieldsValue())); //把表单的变化实时更新到redux中
  };
  return (
    <Form
      layout="vertical" //竖向排列
      initialValues={pageInfo}
      onValuesChange={handleValuesChange} //表单变化时，修改表单里的值
      form={form}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: "请输入标题" }]}
      >
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item label="问卷描述" name="desc">
        <TextArea placeholder="问卷描述..." />
      </Form.Item>
      <Form.Item label="样式代码" name="css">
        <TextArea placeholder="请输入 css 样式代码..." />
      </Form.Item>
      <Form.Item label="脚本代码" name="js">
        <TextArea placeholder="请输入 js 样式代码..." />
      </Form.Item>
    </Form>
  );
};
export default PageSetting;
