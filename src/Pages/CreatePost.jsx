import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';

const { Title } = Typography;

const CreatePost = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    console.log(values);
    setTimeout(() => {
      message.success('Post created successfully!');
      setLoading(false);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <div
      style={{
        background: hover ? '#28244a' : '#1f1c3a',
        borderRadius: 16,
        padding: 40,
        maxWidth: 700,
        margin: '0 auto',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'white',
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.08)',
        transition: 'background 0.2s',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Title level={3} style={{ color: 'white' }}>Create New Post</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label={<span style={{ color: 'white' }}>Title</span>} name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
          <Input placeholder="Enter post title" />
        </Form.Item>
        <Form.Item label={<span style={{ color: 'white' }}>Content</span>} name="content" rules={[{ required: true, message: 'Please enter content' }]}>
          <Input.TextArea rows={6} placeholder="Write your post here..." />
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: '#8b5cf6',
              borderRadius: 8,
              minWidth: 550,
              height: 44,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Post
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePost;