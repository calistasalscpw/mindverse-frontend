import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import API from '../api';

const { Title } = Typography;

const CreatePost = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const postData = {
        title: values.title,
        body: values.body
      };

      await API.post('/forum', postData, {withCredentials: true});

      message.success('Post created successfully!');
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error){
      const errorMessage = error.response?.data?.message || 'Failed to create post. Please log in and try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: hover ? '#28244a' : '#1f1c3a',
          borderRadius: 16,
          padding: 40,
          width: '100%',
          maxWidth: 700,
          position: 'relative',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'white',
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.2)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
      <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            fontSize: '18px',
            padding: 8,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        
        <Title level={3} style={{ color: 'white', marginBottom: 24 }}>Create New Post</Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item 
            label={<span style={{ color: 'white' }}>Title</span>} 
            name="title" 
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input 
              placeholder="Enter post title"
              allowClear={false}
              style={{
                background: '#13111f',
                border: 'none',
                color: 'white',
                padding: '12px 16px',
              }}
            />
          </Form.Item>
          <Form.Item 
            label={<span style={{ color: 'white' }}>Content</span>} 
            name="body" 
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <Input.TextArea 
              rows={6} 
              placeholder="Write your post here..."
              allowClear={false}
              style={{
                background: '#13111f',
                border: 'none',
                color: 'white',
                padding: '12px 16px',
              }}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, display: 'flex', justifyContent: 'center' }}>
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
    </div>
  );
};

export default CreatePost;