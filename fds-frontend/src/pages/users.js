import React, { useState } from 'react';
import { Space, Table, Tag, Input, Modal } from 'antd';

function Users() {
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isDeactivateVisible, setIsDeactivateVisible] = useState(false);
  const showChangePassword = () => {
    setIsChangePasswordVisible(true);
  };
  const showModalDeactivate = () => {
    setIsDeactivateVisible(true);
  };

  const handleOk = () => {
    setIsChangePasswordVisible(false);
    setIsDeactivateVisible(false);
  };

  const handleCancel = () => {
    setIsChangePasswordVisible(false);
    setIsDeactivateVisible(false);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, { type }) => {
        let color = type === 'Admin' ? 'geekblue' : 'green';
        return (
          <Tag color={color} >
            {type.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={showChangePassword}>Change password</a> |
          <a onClick={showModalDeactivate}>Deactivate</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: '1',
      name: 'Ahmad Jamal',
      type: 'Reviewer',
      address: 'Ramallah',
      // tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Mohanad Mohammad',
      type: 'Admin',
      address: 'Jenin',
      // tags: ['loser'],
    },
    {
      key: '3',
      name: 'Israa Mazaraa',
      type: 'Reviewer',
      address: 'Jerusalem',
      // tags: ['cool', 'teacher'],
    },
    {
      key: '4',
      name: 'Baraa',
      type: 'Reviewer',
      address: 'Hebron',
      // tags: ['cool', 'teacher'],
    }
  ];

  return (
    <div>
      <Table columns={columns} dataSource={data} />
      <Modal title="Deactivate user" visible={isDeactivateVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure to deactivate this user</p>
      </Modal>
      <Modal title="Change uesr password" visible={isChangePasswordVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Enter new password</p>
        <Input.Password placeholder="password" />
      </Modal>
    </div>
  );
}

export default Users;