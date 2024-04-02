import React, { ChangeEvent, FC, useState } from "react";
import { Button, Typography, Space, Input, message } from "antd";
import { LeftOutlined, LoginOutlined } from "@ant-design/icons";
import style from "./EditHeader.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import EditToolbar from "./EditToolbar";
import useGetPageInfo from "../../../hooks/useGetPageInfo";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";
import { changePageTitle } from "../../../store/PageInfoReducer";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateQuestionService } from "../../../services/question";
import { useRequest, useKeyPress } from "ahooks";
const { Title } = Typography;

// 显示和修改标题的按钮(在这里修改标题)
const TitleElem: FC = () => {
  const { title } = useGetPageInfo();
  const [editState, setEditState] = useState(false);
  const dispatch = useDispatch();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    // if (!newTitle) return; //没有值直接返回
    dispatch(changePageTitle(newTitle));
  };
  if (editState)
    return (
      <Input
        value={title}
        onChange={handleChange}
        onPressEnter={() => setEditState(false)} //回车的时候
        onBlur={() => setEditState(false)} //失去焦点的时候
      />
    );
  return (
    <Space>
      <Title style={{ paddingBottom: "0", marginTop: "0" }}>{title}</Title>
      <Button //此按钮用来编辑问卷的标题
        icon={<EditOutlined />}
        type="text"
        onClick={() => setEditState(true)}
      />
    </Space>
  );
};

// 保存按钮
const SaveButton: FC = () => {
  const { id } = useParams();
  const { componentList = [] } = useGetComponentInfo(); //获取组件列表
  const pageInfo = useGetPageInfo();

  const { loading, run: save } = useRequest(
    async () => {
      if (!id) return;
      await updateQuestionService(id, { ...pageInfo, componentList });
    },
    { manual: true }
  );
  // 快捷键
  useKeyPress(["ctrl.s", "meta.s"], (event: KeyboardEvent) => {
    event.preventDefault(); //禁止网页的默认行为，然后保存
    if (!loading) save();
  });
  return (
    <Button
      onClick={save}
      disabled={loading}
      icon={loading ? <LoginOutlined /> : null}
    >
      保存
    </Button>
  );
};

// 发布按钮
const PublishButton: FC = () => {
  // 发布:isPublished
  const { id } = useParams();
  const nav = useNavigate();
  const { componentList = [] } = useGetComponentInfo();
  const pageInfo = useGetPageInfo();
  const { loading, run: pub } = useRequest(
    async () => {
      if (!id) return;
      await updateQuestionService(id, {
        ...pageInfo,
        componentList,
        isPublished: true, //标志问卷已被发布
      });
    },
    {
      manual: true,
      onSuccess() {
        message.success("发布成功");
        nav("/question/stat/" + id); // 然后跳转到统计页面
      },
    }
  );
  return (
    <Button type="primary" onClick={pub} disabled={loading}>
      发布
    </Button>
  );
};

// 编辑器头部
const EditHeader: FC = () => {
  const nav = useNavigate();
  return (
    <div className={style["header-wrapper"]}>
      <div className={style.header}>
        <div className={style.left}>
          <Space>
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => nav(-1)} // -1就是返回上一步
            >
              返回
            </Button>
            <TitleElem />
          </Space>
        </div>
        <div className={style.main}>
          <EditToolbar />
        </div>
        <div className={style.right}>
          <Space style={{ marginTop: "5px" }}>
            <SaveButton />
            <PublishButton />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default EditHeader;
