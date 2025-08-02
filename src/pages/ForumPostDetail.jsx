import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Layout, Spin, Avatar, Space, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import API from '../api';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ForumPostDetail = () => {
  const { postId} = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/forum/${postId}`);
        setPost(response.data);
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
        <Title level={4} style={{ color: 'white' }}>{error}</Title>
      </div>
    );
  }

  if (!post) {
    return null; 
  }

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Poppins', background: '#0f0c2a' }}>
      <Content style={{ padding: '2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div
            style={{
              background: hover ? '#28244a' : '#1f1c3a',
              borderRadius: 16,
              padding: 32,
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'white',
              // transition: 'background 0.2s',
              // marginBottom: 32,
            }}
            // onMouseEnter={() => setHover(true)}
            // onMouseLeave={() => setHover(false)}
          >
            <Title level={3} style={{ color: 'white', margin: 0 }}>{post.title}</Title>

            <Space align="center" style={{ marginBottom: 24 }}>
              <Avatar src={post.author?.profileImageUrl} icon={<UserOutlined />} />
              <Text style={{ color: 'white', fontWeight: 500 }}>{post.author?.username || 'Anonymous'}</Text>
              <Text type="secondary" style={{color: '#d1d5db'}}>{formatDate(post.createdAt)}</Text>
            </Space>

            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }}/>

            <Paragraph style={{ color: '#d1d5db', fontSize: '16px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {post.body}
            </Paragraph>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ForumPostDetail;
