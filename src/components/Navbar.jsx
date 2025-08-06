import { Layout, Menu, Input, Space, Avatar, Dropdown, Button, Drawer } from "antd";
import { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { MenuOutlined } from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');

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

  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Header
        style={{
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(6px)",
          padding: "0 1rem",
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
          {/* Mobile hamburger menu */}
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "white", fontSize: "18px" }} />}
            onClick={() => setMobileMenuOpen(true)}
            style={{
              display: "none",
              color: "white",
              border: "none",
              padding: "4px 8px",
            }}
            className="mobile-menu-button"
          />

          {/* Logo and Navigation Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
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
            <Space size="large" className="nav-links">
              <Link
                to="/"
                style={{ color: "white", fontWeight: 500, textDecoration: "none" }}
              >
                Dashboard
              </Link>
              <Link 
                to="/forum" 
                style={{ color: "white", fontWeight: 500, textDecoration: "none" }}
              >
                Forum
              </Link>
            </Space>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }} className="search-container">
            {location.pathname === "/forum" && (
            <Input.Search
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
              style={{
                width: 700,
                maxWidth: "100%",
                borderRadius: 8,
                background: "#1f1c3a",
                color: "white",
                border: "none",
              }}
            />
            )}
          </div>

          {/* User Profile */}
          <div className="user-profile">
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
                  }}
                >
                  <Avatar src={user.profileImageUrl || ''} />
                  <span style={{ color: "white", fontWeight: 500 }} className="username">
                    {user.username}
                  </span>
                </div>
              </Dropdown>
            ) : (
              <Space className="auth-links">
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

      {/* Mobile Sidebar */}
      <Drawer
        title={
          <div style={{ color: "white", fontFamily: "Pacifico", fontSize: "1.2rem" }}>
            MindVerse
          </div>
        }
        placement="left"
        closable={true}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        bodyStyle={{
          background: "#1f1c3a",
          padding: 0,
        }}
        headerStyle={{
          background: "#1f1c3a",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
        closeIcon={<span style={{ color: "white" }}>×</span>}
      >
        <div style={{ padding: "20px 0" }}>
          {/* Mobile Search */}
          <div style={{ padding: "0 20px", marginBottom: "20px" }}>
            <Input.Search
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={(value) => {
                handleSearch(value);
                handleMobileNavClick();
              }}
              style={{
                width: "100%",
                borderRadius: 8,
                background: "#13111f",
                color: "white",
                border: "none",
              }}
            />
          </div>

          {/* Mobile Navigation Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link
              to="/"
              onClick={handleMobileNavClick}
              style={{
                color: "white",
                fontWeight: 500,
                padding: "12px 20px",
                textDecoration: "none",
                display: "block",
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/forum"
              onClick={handleMobileNavClick}
              style={{
                color: "white",
                fontWeight: 500,
                padding: "12px 20px",
                textDecoration: "none",
                display: "block",
              }}
            >
              Forum
            </Link>
          </div>

          {/* Mobile User Section */}
          <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: "20px" }}>
            {user ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: "16px",
                    padding: "8px 0",
                  }}
                >
                  <Avatar src={user.profileImageUrl || ''} size={40} />
                  <span style={{ color: "white", fontWeight: 500 }}>
                    {user.username}
                  </span>
                </div>
                <Button
                  block
                  onClick={() => {
                    logout();
                    handleMobileNavClick();
                  }}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    borderRadius: "6px",
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link
                  to="/auth/login"
                  onClick={handleMobileNavClick}
                  style={{
                    color: "white",
                    fontWeight: 500,
                    padding: "8px 0",
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={handleMobileNavClick}
                  style={{
                    color: "white",
                    fontWeight: 500,
                    padding: "8px 0",
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {/* Simple CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: block !important;
          }
          
          .desktop-nav .nav-links {
            display: none;
          }
          
          .search-container {
            display: none !important;
          }
          
          .user-profile .username {
            display: none;
          }
          
          .auth-links a:last-child {
            display: none;
          }
        }

        @media (max-width: 1024px) {
          .search-container input {
            width: 500px !important;
          }
        }

        @media (max-width: 480px) {
          .desktop-nav {
            gap: 16px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;