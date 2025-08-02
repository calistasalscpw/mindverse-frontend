import React from 'react';
import { Card, Typography, Avatar, Space } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ForumPostCard = ({ post, onClick }) => {
  const authorName = post.author ? post.author.username : 'Anonymous';
  const authorImage = post.author ? post.author.profileImageUrl : null;

  return (
    <div
      style={{
        background: '#1f1c3a',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'white',
        transition: 'background 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#28244a'}
      onMouseLeave={e => e.currentTarget.style.background = '#1f1c3a'}
      onClick={() => onClick(post._id)}
    >
      <Space align="start" size="large">
        <Avatar
          src={authorImage}
          icon={<UserOutlined/>}
          size={40}
        >
          {post.initials}
        </Avatar>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontWeight: 500 }}>{post.author.username}</Text>
            <Text style={{ color: '#d1d5db' }}>{formatDate(post.createdAt)}</Text>
          </div>
          <Title level={4} style={{ color: 'white', marginTop: 8 }}>{post.title}</Title>
          <Paragraph style={{ color: '#d1d5db', marginBottom: 8 }}>{post.body}</Paragraph>
          <Space>
            <MessageOutlined style={{ color: '#9ca3af' }} />
            <Text style={{ color: '#9ca3af' }}>{post.comments} comments</Text>
          </Space>
        </div>
      </Space>
    </div>
  );
};

export default ForumPostCard;
