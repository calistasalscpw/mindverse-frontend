import { Layout, Menu, Input, Space, Avatar, Dropdown } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const profileMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={() => {}}>
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
              to="/dashboard"
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <Avatar src="" />
            <span style={{ color: "white", fontWeight: 500 }}>Ayam</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
