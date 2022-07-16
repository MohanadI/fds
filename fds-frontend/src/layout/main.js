import React from "react";
import { Layout, Menu } from "antd";
import { Routes, Route, Link } from "react-router-dom";

import Transactions from "../pages/transactions";

import {
  // MailOutlined,
  CodepenCircleFilled,
  WindowsFilled,
  ProfileFilled,
  ThunderboltFilled,
  SkinFilled,
} from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

function Main() {
  return (
    <Layout>
      <Header>
        <Menu mode="horizontal" defaultSelectedKeys={["transactions"]}>
          <Menu.Item key="logo" icon={<CodepenCircleFilled />}>
            <Link to="/">FDS</Link>
          </Menu.Item>
          <Menu.Item key="transactions" icon={<ThunderboltFilled />}>
            <Link to="/">LIVE</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Routes>
          <Route path="/" element={<Transactions />} />
        </Routes>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default Main;
