import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Layout } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const ForumPostDetail = () => {
  const { postid } = useParams();
  const [hover, setHover] = useState(false);

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
              transition: 'background 0.2s',
              marginBottom: 32,
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Title level={3} style={{ color: 'white', margin: 0 }}>Post Detail (ID: {postid})</Title>
            <Paragraph style={{ color: '#d1d5db', margin: 0 }}>
              This is the post detail page.
            </Paragraph>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ForumPostDetail;
