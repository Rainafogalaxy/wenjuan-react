import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import useLoadUserData from "../hooks/useLoadUserData";
import { Spin } from "antd";
const QuestionLayout: FC = () => {
  const { waitingUserData } = useLoadUserData();
  return (
    <>
      <p>Question Layout</p>
      <div>
        {waitingUserData ? (
          <div style={{ textAlign: "center", marginTop: "200px" }}>
            <Spin />
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </>
  );
};

export default QuestionLayout;
