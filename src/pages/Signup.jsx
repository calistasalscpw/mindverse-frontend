import React, { useState } from 'react';
import { LockOutlined, UserOutlined, MailOutlined, GoogleOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Divider, Input, Typography, message, Upload, Flex } from "antd";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return false;
        }
        setFile(file);
        setLoading(true);
        getBase64(file, url => {
            setImageUrl(url);
            setLoading(false);
        })
        return false;
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onFinish = async (values) => {
        const formData = new FormData();
        const userData = {
            username: values.username,
            email: values.email,
            password: values.password
        };
        if (file) formData.append("profileImageUrl", file);

        try {
            await API.post('/auth/signup', userData);
            message.success("Signup successful! Please check your email to verify your account.");
            navigate('/auth/login');
        } catch (error) {
            message.error(error.response?.data?.message || "Signup failed");
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/login/google';
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
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
                        Sign Up
                    </Title>
                </div>

                <Form name="signup" onFinish={onFinish} layout="vertical" size="large" autoComplete="off">
                    <Flex justify="center" style={{ marginBottom: '24px' }}>
                        <Upload
                            name="avatar"
                            listType="picture-circle"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> : uploadButton}
                        </Upload>
                    </Flex>

                    <Form.Item
                        name="username"
                        label={<Text strong style={{ color: '#374151', fontSize: '14px' }}>Username</Text>}
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            style={{ borderRadius: '6px', height: '40px', borderColor: '#d1d5db', fontSize: '14px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={<Text strong style={{ color: '#374151', fontSize: '14px' }}>Email</Text>}
                        rules={[{ required: true, type: 'email', message: "Please input a valid E-mail!" }]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            style={{ borderRadius: '6px', height: '40px', borderColor: '#d1d5db', fontSize: '14px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<Text strong style={{ color: '#374151', fontSize: '14px' }}>Password</Text>}
                        rules={[{ required: true, message: "Please input your Password!" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            style={{ borderRadius: '6px', height: '40px', borderColor: '#d1d5db', fontSize: '14px' }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '24px' }}>
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
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>

                <Divider>Or</Divider>

                <Button block icon={<GoogleOutlined />} onClick={handleGoogleLogin} size="large" style={{ borderRadius: '25px', height: '48px' }}>
                    Sign up with Google
                </Button>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <Link to="/auth/login" style={{ color: '#602080', textDecoration: 'none', fontWeight: '500' }}>
                            Login here!
                        </Link>
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default Signup;