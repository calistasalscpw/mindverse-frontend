import React, {useState} from "react";
import {LockOutlined, UserOutlined, MailOutlined, GoogleOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import { Form, Card, Input } from "antd";

const Signup = () => {
    const [loading, setLoading] = useState(false);


    return(
        <div>
            <Card title="Sign Up" style={{ width: 400 }}>
                <Form name="signup" onFinish={onFinish} autoComplete="off">
                    <Form.Item name="username" rules={[{required: true, message: "Please input your username!"}]}>
                        <Input prefix={<UserOutlined/>} placeholder="Username"/>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}