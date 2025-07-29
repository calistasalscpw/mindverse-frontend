import { Layout, Menu, Input, Space, Avatar } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
    },
    {
      key: 'forum',
      label: 'Forum',
    },
  ];

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#602080',
        padding: '0 24px',
        height: '64px',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'white',
            borderRadius: '4px',
            marginRight: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#602080',
            fontSize: '12px',
          }}
        >
          logo
        </div>
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="horizontal"
        items={menuItems}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          flex: 1,
          marginLeft: '24px',
        }}
      />

      {/* Search and User */}
      <Space size="large">
        <Input
          placeholder="Search tasks..."
          prefix={<SearchOutlined />}
          style={{
            width: '240px',
            borderRadius: '6px',
          }}
        />
        <Space>
          <Avatar
            size="small"
            style={{
              backgroundColor: '#1890ff',
            }}
          >
            JD
          </Avatar>
          <span style={{ color: 'white', fontSize: '14px' }}>John Doe</span>
        </Space>
      </Space>
    </Header>
  );
};

export default Navbar;