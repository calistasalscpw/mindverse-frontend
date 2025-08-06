import React from 'react';
import { Card, Typography, Avatar, Space } from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ForumPostCard = ({ post, onClick }) => {
  const authorName = post.author?.username || 'Anonymous';
  const authorImage = post.author?.profileImageUrl || null;

  return (
    <div
      className="forum-post-card"
      onClick={() => onClick(post._id)}
    >
      <Space align="start" size="large" className="post-content">
        <Avatar
          src={authorImage}
          icon={<UserOutlined/>}
          size={40}
          className="post-avatar"
        >
          {post.initials}
        </Avatar>
        <div style={{ flex: 1 }} className="post-details">
          <div className="post-meta">
            <Text className="author-name">{authorName}</Text>
            <Text className="post-date">{formatDate(post.createdAt)}</Text>
          </div>
          <Title level={4} className="post-title">{post.title}</Title>
          <Paragraph className="post-body">{post.body}</Paragraph>
          <Space className="post-footer">
            <MessageOutlined className="comment-icon" />
            <Text className="comment-count">{post.comments || 0} comments</Text>
          </Space>
        </div>
      </Space>

      {/* Responsive CSS */}
      <style jsx>{`
        .forum-post-card {
          background: #1f1c3a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          transition: background 0.2s;
          cursor: pointer;
        }

        .forum-post-card:hover {
          background: #28244a;
        }

        .post-content {
          width: 100%;
          align-items: flex-start;
        }

        .post-avatar {
          flex-shrink: 0;
        }

        .post-details {
          flex: 1;
          min-width: 0;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .author-name {
          color: white !important;
          font-weight: 500 !important;
          font-size: 14px;
        }

        .post-date {
          color: #d1d5db !important;
          font-size: 13px;
        }

        .post-title {
          color: white !important;
          margin-top: 8px !important;
          margin-bottom: 8px !important;
          font-size: 18px !important;
          line-height: 1.3 !important;
        }

        .post-body {
          color: #d1d5db !important;
          margin-bottom: 8px !important;
          font-size: 14px;
          line-height: 1.5;
        }

        .post-footer {
          margin-top: 12px;
        }

        .comment-icon {
          color: #9ca3af;
        }

        .comment-count {
          color: #9ca3af !important;
          font-size: 13px;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .forum-post-card {
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 14px;
          }

          .post-title {
            font-size: 17px !important;
          }

          .post-body {
            font-size: 13px;
          }

          .author-name {
            font-size: 13px;
          }

          .post-date {
            font-size: 12px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .forum-post-card {
            padding: 16px;
            margin-bottom: 16px;
            border-radius: 12px;
          }

          .post-content {
            gap: 12px !important;
          }

          .post-avatar {
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
          }

          .post-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .post-title {
            font-size: 16px !important;
            margin-top: 6px !important;
            margin-bottom: 6px !important;
          }

          .post-body {
            font-size: 13px;
            /* Limit text on mobile for better readability */
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .author-name {
            font-size: 12px;
          }

          .post-date {
            font-size: 11px;
          }

          .comment-count {
            font-size: 12px;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .forum-post-card {
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 10px;
          }

          .post-content {
            gap: 8px !important;
          }

          .post-avatar {
            width: 32px !important;
            height: 32px !important;
            min-width: 32px !important;
          }

          .post-title {
            font-size: 15px !important;
            line-height: 1.2 !important;
          }

          .post-body {
            font-size: 12px;
            -webkit-line-clamp: 2;
          }

          .author-name {
            font-size: 11px;
          }

          .post-date {
            font-size: 10px;
          }

          .comment-count {
            font-size: 11px;
          }

          .post-footer {
            margin-top: 8px;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .forum-post-card {
            padding: 10px;
            margin-bottom: 10px;
          }

          .post-title {
            font-size: 14px !important;
          }

          .post-body {
            font-size: 11px;
          }

          .author-name {
            font-size: 10px;
          }

          .post-date {
            font-size: 9px;
          }
        }

        /* Touch devices - larger tap targets */
        @media (hover: none) and (pointer: coarse) {
          .forum-post-card {
            padding: 18px;
            min-height: 80px;
          }

          .post-title {
            margin-bottom: 12px !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .forum-post-card {
            border: 2px solid rgba(255,255,255,0.3);
          }

          .forum-post-card:hover {
            border: 2px solid rgba(255,255,255,0.5);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .forum-post-card {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ForumPostCard;