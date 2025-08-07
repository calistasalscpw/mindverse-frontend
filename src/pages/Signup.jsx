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
        // const formData = new FormData();
        const userData = {
            username: values.username,
            email: values.email,
            password: values.password,
            profileImageUrl: imageUrl 
        };
        // if (file) formData.append("profileImageUrl", file);

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
        <div className="signup-page-container">
            <div className="signup-form-container">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Title level={2} className="signup-title">
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
                            {imageUrl ? 
                                <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} /> 
                                : uploadButton
                            }
                        </Upload>
                    </Flex>

                    <Form.Item
                        name="username"
                        label={<Text strong className="form-label">Username</Text>}
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={<Text strong className="form-label">Email</Text>}
                        rules={[{ required: true, type: 'email', message: "Please input a valid E-mail!" }]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label={<Text strong className="form-label">Password</Text>}
                        rules={[{ required: true, message: "Please input your Password!" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            className="form-input"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '24px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            className="signup-button"
                        >
                            Sign Up
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
                    Sign up with Google
                </Button>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <Text className="login-link-text">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="login-link">
                            Login here!
                        </Link>
                    </Text>
                </div>
            </div>

            {/* Responsive CSS */}
            <style jsx>{`
                .signup-page-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: calc(100vh - 64px);
                    padding: 20px;
                    box-sizing: border-box;
                }

                .signup-form-container {
                    background-color: white;
                    padding: 48px;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    border: 1px solid #e5e7eb;
                    width: 100%;
                    max-width: 400px;
                }

                .signup-title {
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

                .signup-button {
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

                .login-link-text {
                    color: #6b7280 !important;
                    font-size: 14px !important;
                }

                .login-link {
                    color: #602080 !important;
                    text-decoration: none !important;
                    font-weight: 500 !important;
                }

                .login-link:hover {
                    text-decoration: underline !important;
                }

                .avatar-uploader .ant-upload {
                    width: 80px !important;
                    height: 80px !important;
                }

                /* Tablet Styles */
                @media (max-width: 1024px) {
                    .signup-form-container {
                        max-width: 380px;
                        padding: 40px;
                    }

                    .signup-title {
                        font-size: 26px !important;
                    }
                }

                /* Mobile Styles */
                @media (max-width: 768px) {
                    .signup-page-container {
                        padding: 16px;
                        align-items: flex-start;
                        padding-top: 32px;
                    }

                    .signup-form-container {
                        max-width: 100%;
                        width: 100%;
                        padding: 32px 24px;
                        margin: 0;
                        box-sizing: border-box;
                    }

                    .signup-title {
                        font-size: 24px !important;
                    }

                    .form-input {
                        height: 44px !important;
                        font-size: 16px !important;
                    }

                    .signup-button {
                        height: 52px !important;
                        font-size: 18px !important;
                    }

                    .google-button {
                        height: 52px !important;
                    }

                    .avatar-uploader .ant-upload {
                        width: 100px !important;
                        height: 100px !important;
                    }
                }

                /* Small Mobile Styles */
                @media (max-width: 480px) {
                    .signup-page-container {
                        padding: 12px;
                        padding-top: 24px;
                    }

                    .signup-form-container {
                        padding: 24px 16px;
                        border-radius: 8px;
                    }

                    .signup-title {
                        font-size: 22px !important;
                        margin-bottom: 16px !important;
                    }

                    .form-label {
                        font-size: 15px !important;
                    }

                    .login-link-text {
                        font-size: 13px !important;
                    }

                    .form-input {
                        height: 46px !important;
                        border-radius: 8px !important;
                    }

                    .signup-button {
                        height: 50px !important;
                        border-radius: 12px !important;
                    }

                    .google-button {
                        height: 50px !important;
                        border-radius: 12px !important;
                    }

                    .avatar-uploader .ant-upload {
                        width: 90px !important;
                        height: 90px !important;
                    }
                }

                /* Extra Small Mobile */
                @media (max-width: 360px) {
                    .signup-form-container {
                        padding: 20px 12px;
                    }

                    .signup-title {
                        font-size: 20px !important;
                    }

                    .avatar-uploader .ant-upload {
                        width: 80px !important;
                        height: 80px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Signup;