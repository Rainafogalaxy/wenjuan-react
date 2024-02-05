import React, { FC } from "react";
import { Outlet } from "react-router-dom";
const MainLayout: FC = () => {
  return (
    <>
      <div>MainLayout Header</div>
      <div>
        {/* Outlet类似于Vue的slot */}
        <Outlet />
      </div>
      <div>MainLayout Footer</div>
    </>
  );
};

export default MainLayout;
