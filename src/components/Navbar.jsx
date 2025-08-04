import { Layout, Menu, Input, Space, Avatar, Dropdown } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (value) => {
    if (value) {
      navigate(`/forum?keyword=${value}`);
    } else {
      navigate('/forum');
    }
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.2)",
        backdropFilter: "blur(6px)",
        padding: "0 2rem",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "64px",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                color: "white",
                fontFamily: "Pacifico",
                fontSize: "1.5rem",
              }}
            >
              MindVerse
            </div>
          </Link>
          <Space size="large">
            <Link
              to="/"
              style={{ color: "white", fontWeight: 500 }}
            >
              Dashboard
            </Link>
            <Link to="/forum" style={{ color: "white", fontWeight: 500 }}>
              Forum
            </Link>
          </Space>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Input.Search
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: 700,
              borderRadius: 8,
              background: "#1f1c3a",
              color: "white",
              border: "none",
            }}
            inputStyle={{
              background: "#1f1c3a",
              color: "white",
              border: "none",
            }}
          />
        </div>

        <div>
          {user ? (
        <Dropdown
          overlay={profileMenu}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 24,
              transition: "background 0.2s",
            }}
          >
            <Avatar src={user.profileImageUrl || ''} />
            <span style={{ color: "white", fontWeight: 500 }}>{user.username}</span>
          </div>
        </Dropdown>
          ) : (
            <Space>
              <Link to="/auth/login" style={{ color: "white", fontWeight: 500 }}>
                Login
              </Link>
              <Link to="/auth/signup" style={{ color: "white", fontWeight: 500 }}>
                Sign Up
              </Link>
            </Space>
          )}
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
