import React, { FC, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import { MANAGE_INDEX_PATHNAME, REGISTER_PATHNAME } from "../router";
import style from "./Login.module.scss";
import {
  Typography,
  Space,
  Form,
  Input,
  Button,
  Checkbox,
  message,
} from "antd";
import { loginService } from "../services/user";
import { useRequest } from "ahooks";
import { setToken } from "../utils/user-token";
const { Title } = Typography;
// 定义用户名和密码的常量
const USERNAME_KEY = "USERNAME";
const PASSWORD_KEY = "PASSWORD";
const rememberUser = (username: string, password: string) => {
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(PASSWORD_KEY, password);
};
const deleteUserFromStorage = () => {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PASSWORD_KEY);
};

const getUserInfoFromStorage = () => {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY),
  };
};
const Login: FC = () => {
  // const nav = useNavigate();
  const [form] = Form.useForm(); //第三方hook
  const nav = useNavigate();
  useEffect(() => {
    const { username, password } = getUserInfoFromStorage();
    form.setFieldsValue({ username, password });
  }, []);
  // 为空是在组件渲染完后执行

  const { run } = useRequest(
    async (username: string, password: string) => {
      const data = await loginService(username, password);
      return data;
    },

    {
      manual: true,
      onSuccess(result) {
        const { token = "" } = result;
        setToken(token); //存储Token
        message.success("登录成功");
        nav(MANAGE_INDEX_PATHNAME); //导航到 “我的问卷”页面
      },
    }
  );

  const onFinish = (values: any) => {
    const { username, password, remember } = values;
    run(username, password); //发送请求
    if (remember) {
      rememberUser(username, password);
    } else {
      deleteUserFromStorage();
    }
  };

  return (
    <div className={style.container}>
      <div>
        <Space>
          <Title level={2}>
            <UserAddOutlined />
          </Title>
          <Title level={2}>登录</Title>
        </Space>
      </div>
      <div>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          initialValues={{ remember: true }}
          form={form}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              {
                type: "string",
                min: 5,
                max: 20,
                message:
                  "Please be between 5-20 for the length of the characters",
              },
              {
                pattern: /^\w+$/,
                message: "It can only be letters,numbers or underscores",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{ offset: 6, span: 16 }}
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                登录
              </Button>

              <Link to={REGISTER_PATHNAME}>注册新用户</Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
