import React from "react";
import { Layout, Menu } from "antd";
import { Routes, Route, Link } from "react-router-dom";

import Dashboard from "../pages/dashboard";
import Transactions from "../pages/transactions";
import Reports from "../pages/reports";
import Users from "../pages/users";

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
          <Menu.Item key="dashboard" icon={<WindowsFilled />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="transactions" icon={<ThunderboltFilled />}>
            <Link to="/transactions">Transactions</Link>
          </Menu.Item>
          <Menu.Item key="reports" icon={<ProfileFilled />}>
            <Link to="/reports">Reports</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<SkinFilled />}>
            <Link to="/users">Users</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
  );
}

export default Main;
