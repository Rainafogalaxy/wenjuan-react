import React, { FC } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { Typography, Space, Form, Input, Button } from "antd";
import style from "./Register.module.scss";
import { Link } from "react-router-dom";
import { LOGIN_PATHNAME } from "../router";

const { Title } = Typography;
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
  confirm?: string;
  nickname?: string;
};

const Register: FC = () => {
  const onFinish = (values: any) => {
    console.log(values);
  };
  return (
    <div className={style.container}>
      {/* 标题 */}
      <div>
        <Space>
          <Title level={2}>
            <UserAddOutlined />
          </Title>
          <Title level={2}>注册新用户</Title>
        </Space>
      </div>
      <div>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            label="用户名"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              { type: "string", min: 5, max: 20 ,message:"Please be between 5-20 for the length of the characters"},
              {pattern:/^\w+$/,message:'It can only be letters,numbers or underscores'}
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="密码"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldType>
            label="确认密码"
            name="confirm"
            dependencies={['password']}  //依赖于password，password变化会重新触发validator验证
            rules={[{ required: true, message: "Please input your password!" },
            ({getFieldValue})=>({
              validator(_,value){
                if(!value ||getFieldValue('password') === value){
                  return Promise.resolve()
                }else{
                  return Promise.reject(new Error("密码不一致"))
                }
              }
            })
          ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldType>
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          {/* 按钮 */}
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                注册
              </Button>
              <Link to={LOGIN_PATHNAME}>已有账户,请登录</Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
