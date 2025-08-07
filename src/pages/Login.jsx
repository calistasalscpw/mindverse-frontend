import { Layout } from 'antd';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';

const { Content } = Layout;

const Login = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          backgroundColor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          minHeight: 'calc(100vh - 64px)',
        }}
        className="login-content"
      >
        <LoginForm />
      </Content>

      {/* Responsive CSS */}
      <style jsx>{`
        /* Tablet Styles */
        @media (max-width: 1024px) {
          .login-content {
            padding: 32px 16px !important;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .login-content {
            padding: 24px 12px !important;
            min-height: calc(100vh - 64px) !important;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .login-content {
            padding: 16px 8px !important;
            align-items: flex-start !important;
            padding-top: 32px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Login;