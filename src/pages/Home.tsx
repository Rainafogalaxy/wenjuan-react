import React, { FC } from "react";
import { useNavigate ,Link} from "react-router-dom";
import {Button} from 'antd';
const Home: FC = () => {
const nav = useNavigate();
  function clickHandler(){
    // nav('/login')
    nav({
      pathname:"/login",
      search:"",  //参数
    })
  }

  return <div>
    <p>Home</p>
    <div>
    <Button type="primary">Button</Button>
      <button onClick={clickHandler}>登录</button>
      <Link to="/register">注册</Link>
    </div>
  </div>
};

export default Home;
