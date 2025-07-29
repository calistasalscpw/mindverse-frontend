import { Layout } from 'antd';
import Navbar from '../components/Navbar';
import LoginForm from '../components/LoginForm';

const { Content } = Layout;

const Login = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* <Navbar /> */}
      <Content
        style={{
          backgroundColor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <LoginForm />
      </Content>
    </Layout>
  );
};

export default Login;