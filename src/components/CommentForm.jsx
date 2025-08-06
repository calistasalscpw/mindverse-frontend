import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Space } from 'antd';
import API from '../api';

const { TextArea } = Input;

const CommentForm = ({ postId, onCommentSubmit, currentUser, onCancel, isMobile = false }) => {
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
  const labelStyle = { 
    color: 'white',
    fontSize: isMobile ? '14px' : '14px',
    fontWeight: '500'
  };

  return (
    <div style={{ marginTop: isMobile ? '16px' : '32px' }}>
      <h3 style={{ 
        color: 'white',
        fontSize: isMobile ? '16px' : '18px',
        marginBottom: isMobile ? '12px' : '16px'
      }}>
        Leave a Comment
      </h3>
      
      <Form 
        form={form} 
        name="comment_form" 
        onFinish={onFinish} 
        layout="vertical"
        size={isMobile ? 'small' : 'middle'}
      >
        <Form.Item 
          name="name" 
          label={<span style={labelStyle}>Name</span>} 
          rules={[{ required: true }]}
        >
          <Input 
            placeholder="Your Name" 
            readOnly={!!currentUser}
            style={{
              fontSize: isMobile ? '12px' : '14px'
            }}
          />
        </Form.Item>
        
        <Form.Item 
          name="email" 
          label={<span style={labelStyle}>Email</span>} 
          rules={[{ required: true }, { type: 'email' }]}
        >
          <Input 
            placeholder="Your Email" 
            readOnly={!!currentUser}
            style={{
              fontSize: isMobile ? '12px' : '14px'
            }}
          />
        </Form.Item>
        
        <Form.Item 
          name="body" 
          label={<span style={labelStyle}>Comment</span>} 
          rules={[{ required: true, message: 'Please enter your comment!' }]}
        >
          <TextArea 
            rows={isMobile ? 3 : 4} 
            placeholder="Write your comment here..."
            style={{
              fontSize: isMobile ? '12px' : '14px'
            }}
            autoSize={{ 
              minRows: isMobile ? 3 : 4, 
              maxRows: isMobile ? 6 : 8 
            }}
          />
        </Form.Item>
        
        <Form.Item>
          <Space 
            direction={isMobile ? 'vertical' : 'horizontal'}
            style={{ width: '100%' }}
            size={isMobile ? 'small' : 'middle'}
          >
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              size={isMobile ? 'small' : 'middle'}
              style={{
                backgroundColor: '#8b5cf6',
                borderColor: '#8b5cf6',
                width: isMobile ? '100%' : 'auto'
              }}
            >
              Submit Comment
            </Button>
            <Button 
              onClick={onCancel}
              size={isMobile ? 'small' : 'middle'}
              style={{ width: isMobile ? '100%' : 'auto' }}
            > 
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Responsive CSS */}
      <style jsx>{`
        @media (max-width: 768px) {
          .ant-form-item-label > label {
            font-size: 14px !important;
            color: white !important;
          }
          
          .ant-input,
          .ant-input:focus,
          .ant-input:hover {
            font-size: 14px !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
          }
          
          .ant-btn {
            font-size: 14px !important;
            height: 40px !important;
            border-radius: 6px !important;
            font-weight: 500 !important;
          }
          
          .ant-btn-primary {
            background: #8b5cf6 !important;
            border-color: #8b5cf6 !important;
          }
          
          h3 {
            font-size: 18px !important;
            margin-bottom: 16px !important;
            color: white !important;
          }
          
          .ant-space-vertical {
            width: 100% !important;
          }
          
          .ant-space-vertical .ant-space-item {
            width: 100% !important;
          }
        }

        @media (max-width: 480px) {
          .ant-form-item {
            margin-bottom: 16px !important;
          }
          
          .ant-form-item-label > label {
            font-size: 13px !important;
          }
          
          .ant-input,
          .ant-input:focus,
          .ant-input:hover {
            font-size: 13px !important;
            padding: 8px 10px !important;
          }
          
          .ant-btn {
            font-size: 13px !important;
            height: 36px !important;
          }
          
          h3 {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CommentForm;