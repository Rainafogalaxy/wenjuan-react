import React, { FC, useEffect } from "react";
import { QuestionInfoPropsType } from "./interface";
import { Form, Input } from "antd";
const { TextArea } = Input;
const PropComponent: FC<QuestionInfoPropsType> = (
  props: QuestionInfoPropsType
) => {
  const { title, desc, onChange, disabled } = props;
  const [form] = Form.useForm();
  const handleValuesChange = () => {
    if (onChange) {
      onChange(form.getFieldsValue());
    }
  };
  useEffect(() => {
    form.setFieldsValue({ title, desc });
  }, [title, desc]);
  return (
    <Form
      layout="vertical"
      initialValues={{ title, desc }}
      disabled={disabled}
      form={form}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: "请输入问卷标题" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="描述" name="desc">
        <TextArea />
      </Form.Item>
    </Form>
  );
};

export default PropComponent;
