import React, { FC } from "react";
import style from "./QuestionCard.module.scss";
import { Button, Space, Divider, Tag, Popconfirm ,Modal,message} from "antd";
import {
  EditOutlined,
  LineChartOutlined,
  StarOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

type PropsType = {
  _id: string;
  title: string;
  isStar: boolean;
  isPublished: boolean;
  answerCount: number;
  createdAt: string;
};

const QuestionCard: FC<PropsType> = (props: PropsType) => {
  const nav = useNavigate();
  const {confirm} = Modal;
  const { _id, title, isStar, createdAt, answerCount, isPublished } = props;
  const duplicate = () => {
    message.success('DohKyungSoo')
  };
  const del = ()=>{
    confirm({
      title:"Sure to delete?",
      icon:<ExclamationCircleOutlined/>,
      onOk:()=>{message.success('delete')}
    })
  }
  return (
    <div className={style.container}>
      <div className={style.title}>
        <div className={style.left}>
          <Link
            to={isPublished ? `/question/stat/${_id}` : `/question/edit/${_id}`}
          >
            <Space>
              {isStar && <StarOutlined style={{ color: "coral" }} />}
              {title}
            </Space>
          </Link>
        </div>
        <div className={style.right}>
          <Space>
            {isPublished ? (
              <Tag color="processing">已发布</Tag>
            ) : (
              <Tag>未发布</Tag>
            )}
            <span>答卷:{answerCount}</span>
            <span>{createdAt}</span>
          </Space>
        </div>
      </div>
      <Divider style={{ margin: "12px" }} />
      <div className={style["button-container"]}>
        <div className={style.left}>
          <Space>
            <Button
              icon={<EditOutlined />}
              type="text"
              size="small"
              onClick={() => {
                nav(`/question/edit/${_id}`);
              }}
            >
              编辑问卷
            </Button>
            <Button
              icon={<LineChartOutlined />}
              type="text"
              size="small"
              onClick={() => {
                nav(`/question/stat/${_id}`);
              }}
              disabled={!isPublished} // 禁用
            >
              数据统计
            </Button>
          </Space>
        </div>
        <div className={style.right}>
          <Space>
            <Button type="text" icon={<StarOutlined />} size="small">
              {isStar ? "取消标星" : "标星"}
            </Button>
            <Popconfirm title="Sure to Copy?"
            okText='yes'
            cancelText='cancel'
            onConfirm={duplicate}
            >
              <Button
                type="text"
                icon={<CopyOutlined />}
                size="small"
              >
                复制
              </Button>
            </Popconfirm>
            <Button type="text" icon={<DeleteOutlined />} size="small" onClick={del}>
              删除
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
