import React from 'react';
import { Card, Typography, Avatar, Space } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ForumPostCard = ({ post, onClick }) => {
  return (
    <Card
      onClick={() => onClick(post.id)}
      hoverable
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(4px)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Space align="start" size="large">
        <Avatar
          style={{
            background: post.avatarColor,
            verticalAlign: 'middle',
          }}
          size={40}
        >
          {post.initials}
        </Avatar>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontWeight: 500 }}>{post.author}</Text>
            <Text style={{ color: '#d1d5db' }}>{post.time}</Text>
          </div>
          <Title level={4} style={{ color: 'white', marginTop: 8 }}>{post.title}</Title>
          <Paragraph style={{ color: '#d1d5db', marginBottom: 8 }}>{post.content}</Paragraph>
          <Space>
            <MessageOutlined style={{ color: '#9ca3af' }} />
            <Text style={{ color: '#9ca3af' }}>{post.comments} comments</Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default ForumPostCard;
