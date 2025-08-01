import { Form, Input, Button, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const { Title, Text } = Typography;

const LoginForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    // Di sini nanti bisa tambahkan logic untuk call API login

    try {
      const response = await API.post('/auth/login', values, {
        withCredentials: true,
      });

      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        message.success('Login successful!');
        navigate('/dashboard'); 
      } else {
        message.error('Login failed. Please try again.');
      }
    } catch (error){
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{ color: '#602080', marginBottom: '8px', fontWeight: '600' }}>
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
          label={<Text strong style={{ color: '#374151', fontSize: '14px' }}>Email*</Text>}
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
          <Input
            style={{
              borderRadius: '6px',
              height: '40px',
              borderColor: '#d1d5db',
              fontSize: '14px',
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<Text strong style={{ color: '#374151', fontSize: '14px' }}>Password*</Text>}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password
            style={{
              borderRadius: '6px',
              height: '40px',
              borderColor: '#d1d5db',
              fontSize: '14px',
            }}
          />
        </Form.Item>

        <div style={{ marginBottom: '24px' }}>
          <Text style={{ color: '#6b7280', fontSize: '14px' }}>
            Already have an account?{' '}
            <a
              href="/register"
              style={{
                color: '#602080',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Register here!
            </a>
          </Text>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              background: 'linear-gradient(90deg, #4A1A5A 0%, #8F1383 100%)',
              border: 'none',
              borderRadius: '25px',
              height: '48px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;