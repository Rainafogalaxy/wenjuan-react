import React, { FC, useEffect } from "react";
import { QuestionRadioPropsType, OptionType } from "./interface";
import { Form, Input, Checkbox, Select, Button, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";

const PropComponent: FC<QuestionRadioPropsType> = (
  props: QuestionRadioPropsType
) => {
  const { title, isVertical, value, options = [], onChange, disabled } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({ title, isVertical, value, options });
  }, [title, isVertical, value, options]);
  const handleValuesChange = () => {
    if (!onChange) return;
    //内容 同步到画布
    const newValues = form.getFieldsValue() as QuestionRadioPropsType;
    if (newValues.options) {
      newValues.options = newValues.options.filter(
        (opt) => !(opt.text == null)
      );
    }
    const { options = [] } = newValues;
    options.forEach((opt) => {
      if (opt.value) return; //如果value有值，就直接返回
      // 没有值就给加一个(value要求唯一)
      opt.value = nanoid(5);
    });
    // console.log(newValues);
    onChange(newValues);
  };
  return (
    <Form
      layout="vertical"
      initialValues={{ title, isVertical, value, options }}
      onValuesChange={handleValuesChange}
      disabled={disabled}
      form={form}
    >
      <Form.Item
        label="标题"
        name="title"
        rules={[{ required: true, message: "请输入标题" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {/* 遍历所有的选项 */}
              {fields.map(({ key, name }, index) => {
                return (
                  <Space key={key} align="baseline">
                    {/* 当前选项输入框 */}
                    <Form.Item
                      name={[name, "text"]}
                      rules={[
                        { required: true, message: "请输入选项文字" },
                        // 不能让多个选项的文字重复
                        {
                          validator: (_, text) => {
                            const { options = [] } = form.getFieldsValue(); //获取当前form的所有值
                            let num = 0;
                            // console.log(options);
                            options.forEach((opt: OptionType) => {
                              if (opt.text === text) num++; //记录text相同的个数。应该只有一个
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
                    {index > 1 && (
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
                  onClick={() => add({ text: "", value: "" })}
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
      <Form.Item label="默认选中" name="value">
        <Select
          value={value}
          options={options.map(({ text, value }) => ({
            value,
            label: text || "",
          }))}
        ></Select>
      </Form.Item>
      <Form.Item name="isVertical" valuePropName="checked">
        <Checkbox>竖向排列</Checkbox>
      </Form.Item>
    </Form>
  );
};

export default PropComponent;
