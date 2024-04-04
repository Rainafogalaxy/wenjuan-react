import React, { FC, useRef } from "react";
import style from "./StatHeader.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  Space,
  Button,
  Typography,
  Input,
  Tooltip,
  InputRef,
  message,
  Popover,
} from "antd";
import QRCode from "qrcode.react";
import { CopyOutlined, LeftOutlined, QrcodeOutlined } from "@ant-design/icons";
import useGetPageInfo from "../../../hooks/useGetPageInfo";

const { Title } = Typography;
const StatHeader: FC = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { title, isPublished } = useGetPageInfo();

  // 拷贝链接拷贝的时候需要DOM操作)
  const urlInputRef = useRef<InputRef>(null);
  const copy = () => {
    const elem = urlInputRef.current;
    if (elem == null) return;
    elem.select(); //选中Input的内容
    document.execCommand("copy"); //拷贝选中的内容
    message.success("拷贝成功");
  };

  //生成Link和QR Code
  const genLinkAndQRCodeElem = () => {
    if (!isPublished) return null; //如果未发布，不渲染
    const url = `http://localhost:3000/question/${id}`; //拼接url，需要参考C端的规则
    // 定义二维码组件(二维码就是链接的图形化)
    const ORCodeElem = (
      <div style={{ textAlign: "center" }}>
        <QRCode value={url} size={50} />
      </div>
    );

    return (
      <Space>
        {/* 输入框显示的值完全有value的值来决定，如果不设置onChange无法直接改变 */}
        {/* 如果想根据用户的输入动态更新输入框的内容，要结合value属性和onChange事件处理函数 */}
        {/* 使用value属性绑定了输入框时，就意味着输入框的值不再是自动根据用户输入变化的，而是通过更新组件的状态来改变 */}
        <Input value={url} style={{ width: "300px" }} ref={urlInputRef} />
        <Tooltip title="拷贝链接">
          <Button icon={<CopyOutlined />} onClick={copy}></Button>
        </Tooltip>
        <Popover content={ORCodeElem}>
          <Button icon={<QrcodeOutlined />}></Button>
        </Popover>
      </Space>
    );
  };

  return (
    <div className={style["header-wrapper"]}>
      <div className={style.header}>
        <div className={style.left}>
          <Space>
            <Button type="link" icon={<LeftOutlined />} onClick={() => nav(-1)}>
              返回
            </Button>
            <Title>{title}</Title>
          </Space>
        </div>
        <div className={style.main}>{genLinkAndQRCodeElem()}</div>
        <div className={style.right}>
          <Button type="primary" onClick={() => nav(`/question/edit/${id}`)}>
            编辑问卷
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatHeader;
