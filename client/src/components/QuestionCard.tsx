import React, { FC, useState } from "react";
import style from "./QuestionCard.module.scss";
import { Button, Space, Divider, Tag, Popconfirm, Modal, message } from "antd";
import {
  updateQuestionService,
  duplicateQuestionService,
} from "../services/question";
import { useRequest } from "ahooks";
import {
  EditOutlined,
  LineChartOutlined,
  StarOutlined,
  CopyOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

type PropsType = {
  _id: string; //服务端使用 _id
  title: string;
  isStar: boolean;
  isPublished: boolean;
  answerCount: number;
  createdAt: string;
};

const QuestionCard: FC<PropsType> = (props: PropsType) => {
  const nav = useNavigate();
  const { confirm } = Modal;
  const { _id, title, isStar, createdAt, answerCount, isPublished } = props;

  // 复制的请求函数
  const { loading: duplicateLoading, run: duplicate } = useRequest(
    async () => {
      const data = await duplicateQuestionService(_id);
      return data;
    }, //这里注意，如果写了花括号，就一定要写return
    {
      manual: true,
      onSuccess(result) {
        //返回的结果通过result参数获取
        message.success("复制成功");
        nav(`/question/edit/${result.id}`); //跳转到问卷编辑页
      },
    }
  );
  const del = () => {
    confirm({
      title: "Sure to delete?",
      icon: <ExclamationCircleOutlined />,
      onOk: deleteQuestion,
    });
  };
  // 修改标星
  const [isStarState, setIsStarState] = useState(isStar);
  const { loading: changeStarLoading, run: changeStar } = useRequest(
    async () => {
      await updateQuestionService(_id, { isStar: !isStarState }); //第二个参数是opt
    },
    {
      manual: true,
      onSuccess() {
        setIsStarState(!isStarState);
        message.success("已更新");
      },
    }
  );

  const [isDeletedState, setIsDeletedState] = useState(false); //此状态用于控制点击删除的问卷不要在当前列表页显示
  // 删除的请求
  const { loading: delateLoading, run: deleteQuestion } = useRequest(
    async () => {
      const data = await updateQuestionService(_id, { isDeleted: true }); //第二个参数是要修改(更新)的信息
      return data;
    },
    {
      manual: true,
      onSuccess() {
        message.success("删除成功");
        setIsDeletedState(true);
      },
    }
  );
  if (isDeletedState) return null; //在这里  ： 已经点击删除的问卷，就不用再显示了
  return (
    <div className={style.container}>
      <div className={style.title}>
        <div className={style.left}>
          <Link
            to={isPublished ? `/question/stat/${_id}` : `/question/edit/${_id}`}
          >
            <Space>
              {isStarState && <StarOutlined style={{ color: "coral" }} />}
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
            <Button
              type="text"
              icon={<StarOutlined />}
              size="small"
              onClick={changeStar}
              disabled={changeStarLoading} //在loading状态下按钮禁止点击
            >
              {isStarState ? "取消标星" : "标星"}
            </Button>
            <Popconfirm
              title="Sure to Copy?"
              okText="yes"
              cancelText="cancel"
              onConfirm={duplicate}
            >
              <Button
                type="text"
                icon={<CopyOutlined />}
                size="small"
                disabled={duplicateLoading}
              >
                复制
              </Button>
            </Popconfirm>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              onClick={del}
              disabled={delateLoading}
            >
              删除
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
