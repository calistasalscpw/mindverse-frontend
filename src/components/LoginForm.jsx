import { Form, Input, Button, Typography, message, Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await login(values)
    } catch (error){
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        window.location.href = `${apiUrl}/auth/login/google`;
  };

  return (
    <div className="login-form-container">
      <div className="login-form-content">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} className="login-title">
            Login
          </Title>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label={<Text strong className="form-label">Email*</Text>}
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
          >
            <Input className="form-input" />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text strong className="form-label">Password*</Text>}
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password className="form-input" />
          </Form.Item>

          <div style={{ marginBottom: '24px' }}>
            <Text className="register-link-text">
              Already have an account?{' '}
              <a
                href="/auth/signup"
                className="register-link"
              >
                Register here!
              </a>
            </Text>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="login-button"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider>Or</Divider>
        <Button 
          block 
          icon={<GoogleOutlined />} 
          onClick={handleGoogleLogin} 
          size="large" 
          className="google-button"
        >
          Login with Google
        </Button>
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        .login-form-container {
          background-color: white;
          padding: 48px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          width: 100%;
          max-width: 400px;
        }

        .login-form-content {
          width: 100%;
        }

        .login-title {
          color: #602080 !important;
          margin-bottom: 8px !important;
          font-weight: 600 !important;
          font-size: 28px !important;
        }

        .form-label {
          color: #374151 !important;
          font-size: 14px !important;
        }

        .form-input {
          border-radius: 6px !important;
          height: 40px !important;
          border-color: #d1d5db !important;
          font-size: 14px !important;
        }

        .register-link-text {
          color: #6b7280 !important;
          font-size: 14px !important;
        }

        .register-link {
          color: #602080 !important;
          text-decoration: none !important;
          font-weight: 500 !important;
        }

        .register-link:hover {
          text-decoration: underline !important;
        }

        .login-button {
          background: linear-gradient(90deg, #4A1A5A 0%, #8F1383 100%) !important;
          border: none !important;
          border-radius: 25px !important;
          height: 48px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          color: white !important;
        }

        .google-button {
          border-radius: 25px !important;
          height: 48px !important;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .login-form-container {
            max-width: 380px;
            padding: 40px;
          }

          .login-title {
            font-size: 26px !important;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .login-form-container {
            max-width: 100%;
            width: 100%;
            padding: 32px 24px;
            margin: 0 8px;
            box-sizing: border-box;
          }

          .login-title {
            font-size: 24px !important;
          }

          .form-input {
            height: 44px !important;
            font-size: 16px !important;
          }

          .login-button {
            height: 52px !important;
            font-size: 18px !important;
          }

          .google-button {
            height: 52px !important;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .login-form-container {
            padding: 24px 16px;
            border-radius: 8px;
            margin: 0 4px;
          }

          .login-title {
            font-size: 22px !important;
            margin-bottom: 16px !important;
          }

          .form-label {
            font-size: 15px !important;
          }

          .register-link-text {
            font-size: 13px !important;
          }

          .form-input {
            height: 46px !important;
            border-radius: 8px !important;
          }

          .login-button {
            height: 50px !important;
            border-radius: 12px !important;
          }

          .google-button {
            height: 50px !important;
            border-radius: 12px !important;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .login-form-container {
            padding: 20px 12px;
          }

          .login-title {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;