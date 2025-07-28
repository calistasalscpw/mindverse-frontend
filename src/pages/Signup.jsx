import React, {useState} from "react";
import {LockOutlined, UserOutlined, MailOutlined, GoogleOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import { Button, Form, Divider, Input, Card, message, Upload, Flex } from "antd";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { inline } from './../../node_modules/@rc-component/portal/es/mock';

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
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("password", values.password);
        if (file) formData.append("profileImageUrl", file);

        try{
            const res = await API.post('/auth/signup', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error("Signup failed");
            message.success("Signup successful!");
            navigate('/auth/login');
        } catch (error){
            message.error("Signup failed: " + error.message);
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/auth/login/google';
    }

    return(
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh'}}>
            <Card title="Sign Up" style={{ width: 400 }} headStyle={{ textAlign: 'center', color: '#602080' }}>
                <Form name="signup" onFinish={onFinish} autoComplete="off" >
                    <Flex gap="middle" wrap justify="center" style={{ marginBottom: '1rem'}}>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </Flex>
                    
                    <Form.Item name="username" rules={[{required: true, message: "Please input your username!"}]}>
                        <Input prefix={<UserOutlined/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item name="email" rules={[{required: true, type: 'email', message: "Please input a valid E-mail!"}]}>
                        <Input prefix={<MailOutlined/>} placeholder="E-mail"/>
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
                        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button block htmlType="submit" style={{background: 'linear-gradient(to right, #45056E, #8F1383)', border: 'none', color: 'white', fontWeight: 'bold'}}>Sign Up</Button>
                    </Form.Item>
                </Form>
                <Divider>Or</Divider>
                <Button block icon={<GoogleOutlined />} onClick={handleGoogleLogin}>
                Sign up with Google
                </Button>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account? <a href="/auth/login" style={{color: '#602080'}}>Login here!</a>
                </div>
            </Card>
        </div>
    )
}

export default Signup;