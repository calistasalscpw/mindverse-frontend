import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Layout, Spin, Avatar, Space, Divider, List, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext'; 
import CommentForm from '../components/CommentForm'; 
import API from '../api';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ForumPostDetail = () => {
  const { user } = useAuth(); 
  const { postId} = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false); 

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/forum/${postId}`);
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (err) {
        setError('Failed to load post. It may have been deleted or the link is incorrect.');
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Add: Handler for comment submission
  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
    setIsFormVisible(false); 
  };

  // Add: Handler for canceling comment form
  const handleCancelComment = () => {
    setIsFormVisible(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Title level={4} style={{ color: 'white' }}>{error}</Title>
      </div>
    );
  }

  if (!post) {
    return null; 
  }

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Poppins', background: '#0f0c2a' }}>
      <Content className="post-detail-content">
        <div className="post-detail-container">
          <div className="post-card">
            <Title level={3} className="post-title">{post.title}</Title>

            <Space align="center" className="post-meta">
              <Avatar src={post.author?.profileImageUrl} icon={<UserOutlined />} className="author-avatar" />
              <Text className="author-name">{post.author?.username || 'Anonymous'}</Text>
              <Text className="post-date">{formatDate(post.createdAt)}</Text>
            </Space>

            <Divider className="post-divider"/>

            <Paragraph className="post-body">
              {post.body}
            </Paragraph>

            <Divider className="post-divider" />

            <Title level={4} className="comments-title">Comments ({comments.length})</Title>
            <List
              dataSource={comments}
              itemLayout="horizontal"
              className="comments-list"
              renderItem={item => (
                <List.Item className="comment-item">
                  <List.Item.Meta
                    avatar={<Avatar className="comment-avatar">{item.name.charAt(0).toUpperCase()}</Avatar>}
                    title={<Text className="comment-author">{item.name}</Text>}
                    description={<Text className="comment-body">{item.body}</Text>}
                  />
                </List.Item>
              )}
            />
            
            <Divider className="post-divider" />

            {/* Add: Logic for showing comment form */}
            {!isFormVisible && (
              <Button type="primary" onClick={() => setIsFormVisible(true)} className="add-comment-button">
                Add Comment
              </Button>
            )}

            {isFormVisible && (
              <CommentForm 
                postId={postId} 
                onCommentSubmit={handleCommentAdded}
                currentUser={user}
                onCancel={handleCancelComment}
              />
            )}
          </div>
        </div>
      </Content>

      {/* Responsive CSS */}
      <style jsx>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: calc(100vh - 64px);
        }

        .error-container {
          text-align: center;
          padding: 50px;
        }

        .post-detail-content {
          padding: 2rem;
        }

        .post-detail-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .post-card {
          background: #1f1c3a;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
        }

        .post-title {
          color: white !important;
          margin: 0 !important;
          font-size: 28px !important;
          line-height: 1.3 !important;
          margin-bottom: 24px !important;
        }

        .post-meta {
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .author-avatar {
          flex-shrink: 0;
        }

        .author-name {
          color: white !important;
          font-weight: 500 !important;
          font-size: 16px;
        }

        .post-date {
          color: #d1d5db !important;
          font-size: 14px;
        }

        .post-divider {
          border-color: rgba(255,255,255,0.1) !important;
          margin: 24px 0 !important;
        }

        .post-body {
          color: #d1d5db !important;
          font-size: 16px !important;
          line-height: 1.7 !important;
          white-space: pre-wrap;
          margin-bottom: 0 !important;
        }

        .comments-title {
          color: white !important;
          font-size: 20px !important;
          margin-bottom: 16px !important;
        }

        .comments-list {
          margin-bottom: 24px;
        }

        .comment-item {
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
          padding: 16px 0 !important;
        }

        .comment-item:last-child {
          border-bottom: none !important;
        }

        .comment-avatar {
          background-color: #8b5cf6;
          color: white;
        }

        .comment-author {
          color: white !important;
          font-weight: 500 !important;
        }

        .comment-body {
          color: #d1d5db !important;
          line-height: 1.5;
        }

        .add-comment-button {
          background-color: #8b5cf6 !important;
          border-color: #8b5cf6 !important;
          border-radius: 8px !important;
          height: 40px !important;
          font-weight: 500 !important;
        }

        .add-comment-button:hover {
          background-color: #7c3aed !important;
          border-color: #7c3aed !important;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .post-detail-content {
            padding: 1.5rem;
          }

          .post-card {
            padding: 28px;
          }

          .post-title {
            font-size: 26px !important;
          }

          .post-body {
            font-size: 15px !important;
          }

          .author-name {
            font-size: 15px;
          }

          .comments-title {
            font-size: 18px !important;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .post-detail-content {
            padding: 1rem;
          }

          .post-card {
            padding: 20px;
            border-radius: 12px;
          }

          .post-title {
            font-size: 22px !important;
            margin-bottom: 20px !important;
          }

          .post-meta {
            margin-bottom: 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .author-name {
            font-size: 14px;
          }

          .post-date {
            font-size: 13px;
          }

          .post-divider {
            margin: 20px 0 !important;
          }

          .post-body {
            font-size: 14px !important;
            line-height: 1.6 !important;
          }

          .comments-title {
            font-size: 17px !important;
            margin-bottom: 12px !important;
          }

          .comment-item {
            padding: 12px 0 !important;
          }

          .comment-author {
            font-size: 14px !important;
          }

          .comment-body {
            font-size: 13px !important;
          }

          .add-comment-button {
            width: 100%;
            height: 44px !important;
            font-size: 16px !important;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .post-detail-content {
            padding: 0.75rem;
          }

          .post-card {
            padding: 16px;
            border-radius: 10px;
          }

          .post-title {
            font-size: 20px !important;
            margin-bottom: 16px !important;
          }

          .post-meta {
            margin-bottom: 16px;
          }

          .author-name {
            font-size: 13px;
          }

          .post-date {
            font-size: 12px;
          }

          .post-divider {
            margin: 16px 0 !important;
          }

          .post-body {
            font-size: 13px !important;
          }

          .comments-title {
            font-size: 16px !important;
            margin-bottom: 10px !important;
          }

          .comment-item {
            padding: 10px 0 !important;
          }

          .comment-author {
            font-size: 13px !important;
          }

          .comment-body {
            font-size: 12px !important;
          }

          .add-comment-button {
            height: 42px !important;
            font-size: 15px !important;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .post-detail-content {
            padding: 0.5rem;
          }

          .post-card {
            padding: 12px;
          }

          .post-title {
            font-size: 18px !important;
          }

          .post-body {
            font-size: 12px !important;
          }

          .comments-title {
            font-size: 15px !important;
          }

          .add-comment-button {
            height: 40px !important;
            font-size: 14px !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .add-comment-button {
            min-height: 48px !important;
          }

          .comment-item {
            padding: 16px 0 !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .post-card {
            border: 2px solid rgba(255,255,255,0.3);
          }

          .post-divider {
            border-color: rgba(255,255,255,0.5) !important;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .add-comment-button {
            transition: none;
          }
        }

        /* Loading and error responsive styles */
        @media (max-width: 768px) {
          .loading-container {
            height: calc(100vh - 64px);
            padding: 20px;
          }

          .error-container {
            padding: 30px 20px;
          }

          .error-container h4 {
            font-size: 18px !important;
          }
        }

        @media (max-width: 480px) {
          .error-container {
            padding: 20px 16px;
          }

          .error-container h4 {
            font-size: 16px !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default ForumPostDetail;