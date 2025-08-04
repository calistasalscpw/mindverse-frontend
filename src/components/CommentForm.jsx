import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space } from 'antd';
import API from '../api';

const { TextArea } = Input;

const CommentForm = ({ postId, onCommentSubmit, currentUser, onCancel }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form with current user's data when available
  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        name: currentUser.username,
        email: currentUser.email,
      });
    }
  }, [currentUser, form]);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const response = await API.post(`/forum/${postId}/comments`, values);
      message.success('Comment submitted successfully!');
      
      // Reset the entire form. useEffect will repopulate name/email if needed.
      form.resetFields();
      
      if (onCommentSubmit) {
        onCommentSubmit(response.data);
      }
    } catch (error) {
      message.error('Failed to submit comment.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Consistent styling for labels
  const labelStyle = { color: 'white' };

  return (
    <div style={{ marginTop: '32px' }}>
      <h3 style={{ color: 'white' }}>Leave a Comment</h3>
      <Form form={form} name="comment_form" onFinish={onFinish} layout="vertical">
        <Form.Item name="name" label={<span style={labelStyle}>Name</span>} rules={[{ required: true }]}>
          <Input placeholder="Your Name" readOnly={!!currentUser} />
        </Form.Item>
        <Form.Item name="email" label={<span style={labelStyle}>Email</span>} rules={[{ required: true }, { type: 'email' }]}>
          <Input placeholder="Your Email" readOnly={!!currentUser} />
        </Form.Item>
        <Form.Item name="body" label={<span style={labelStyle}>Comment</span>} rules={[{ required: true, message: 'Please enter your comment!' }]}>
          <TextArea rows={4} placeholder="Write your comment here..." />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Submit Comment
            </Button>
            <Button onClick={onCancel}> 
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CommentForm;