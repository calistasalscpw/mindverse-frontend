import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Layout } from 'antd';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const ForumPostDetail = () => {
  const { id } = useParams();

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Poppins', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
      <Content style={{ padding: '2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title style={{ color: 'white' }}>Post Detail (ID: {id})</Title>
          <Paragraph style={{ color: '#d1d5db' }}>
            This is the post detail page. You can fetch data from the backend using the ID and display it here.
          </Paragraph>
        </div>
      </Content>
    </Layout>
  );
};

export default ForumPostDetail;
