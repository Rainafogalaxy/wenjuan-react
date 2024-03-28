import React, { FC } from "react";
import { Form, Input, Checkbox, Button, Space } from "antd";
import { QuestionCheckboxPropsType } from "./interface";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { OptionType } from "./interface";
import { nanoid } from "nanoid";

const PropsComponent: FC<QuestionCheckboxPropsType> = (
  props: QuestionCheckboxPropsType
) => {
  const { title, isVertical, list = [], onChange, disabled } = props;
  const [form] = Form.useForm();
  const handleValuesChange = () => {
    if (onChange == null) return;
    const newValues = form.getFieldsValue() as QuestionCheckboxPropsType;
    if (newValues.list) {
      newValues.list = newValues.list.filter((l) => !(l.text == null));
    }
    const { list = [] } = newValues;
    list.forEach((l) => {
      if (l.value) return;
      l.value = nanoid();
    });
    onChange(newValues);
  };
  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ title, isVertical, list }}
      disabled={disabled}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: "请输入标题" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="选项">
        <Form.List name="list">
          {(fields, { add, remove }) => (
            <>
              {/* 遍历所有的选项 */}
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline">
                    {/* 当前选项是否选中 */}
                    {/* Checkbox没有value属性 */}
                    <Form.Item name={[name, "checked"]} valuePropName="checked">
                      <Checkbox />
                    </Form.Item>

                    {/* 当前选项输入框 */}
                    <Form.Item
                      name={[name, "text"]}
                      rules={[
                        { required: true, message: "请输入选项文字" },
                        // 不能让多个选项的文字重复
                        {
                          validator: (_, text) => {
                            const { list = [] } = form.getFieldsValue(); //获取当前form的所有值
                            let num = 0;
                            // console.log(options);
                            list.forEach((l: OptionType) => {
                              if (l.text === text) num++; //记录text相同的个数。应该只有一个
                            });
                            if (num === 1) return Promise.resolve();
                            return Promise.reject(new Error("与其他选项重复"));
                          },
                        },
                      ]}
                    >
                      <Input placeholder="请输入选项文字" />
                    </Form.Item>
                    {/* 当前选项删除按钮 */}
                    {/* 这里应有一个条件:如果只有两个选项，就不要删除了，所以让index > 1 */}
                    {index > 0 && (
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(name);
                        }}
                      />
                    )}
                  </Space>
                );
              })}
              {/* 添加选项 */}
              <Form.Item>
                <Button
                  type="link"
                  onClick={() => add({ text: "", value: "", checked: false })}
                  icon={<PlusOutlined />}
                  block //给按钮居中
                >
                  添加选项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  );
};

export default PropsComponent;
