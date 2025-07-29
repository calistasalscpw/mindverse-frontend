import React, { useState } from 'react';
import { Button, Form, Input, Typography, Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

const CreatePost = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Post created:', values);
      message.success('Post created successfully!');
      setLoading(false);
      navigate('/forum');
    }, 1000);
  };

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Poppins', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
      <Header style={{ backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(6px)', padding: '0 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ color: 'white', fontFamily: 'Pacifico', fontSize: '1.5rem' }}>logo</div>
          <div style={{ color: 'white' }}>Create Post</div>
        </div>
      </Header>
      <Content style={{ padding: '2rem' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
          <Title level={3} style={{ color: 'white' }}>Create New Post</Title>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label={<span style={{ color: 'white' }}>Title</span>} name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
              <Input placeholder="Enter post title" />
            </Form.Item>
            <Form.Item label={<span style={{ color: 'white' }}>Content</span>} name="content" rules={[{ required: true, message: 'Please enter content' }]}>
              <Input.TextArea rows={6} placeholder="Write your post here..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#8b5cf6', borderRadius: 8 }}>
                Post
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default CreatePost;
