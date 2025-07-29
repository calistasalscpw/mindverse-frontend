import React, { useState } from 'react';
import { Button, Input, Typography, Pagination, Layout, Space, Dropdown, Avatar } from 'antd';
import ForumPostCard from '../components/ForumPostCard';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Title } = Typography;

const dummyPosts = [
  {
    id: 1,
    author: 'David Kim',
    time: '2 hours ago',
    title: 'Best practices for React state management in 2025',
    content: 'I\'ve been working on a large React application...',
    comments: 23,
    initials: 'DK',
    avatarColor: 'linear-gradient(to right, #60a5fa, #2563eb)',
  },
  {
    id: 2,
    author: 'Rachel Martinez',
    time: '4 hours ago',
    title: 'How to create accessible color palettes for web applications',
    content: 'Accessibility is crucial in modern web design...',
    comments: 7,
    initials: 'RM',
    avatarColor: 'linear-gradient(to right, #34d399, #059669)',
  },
];

const Forum = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const navigate = useNavigate();

  const filteredPosts = dummyPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const profileMenu = (
    <div>
      <a style={{ color: 'black' }} onClick={() => {}}>Profile</a>
      <a style={{ color: 'black' }} onClick={() => {}}>Logout</a>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Poppins', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
      <Header style={{
  backgroundColor: 'rgba(0,0,0,0.2)',
  backdropFilter: 'blur(6px)',
  padding: '0 2rem',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
}}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    justifyContent: 'space-between',
    width: '100%',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <div style={{ color: 'white', fontFamily: 'Pacifico', fontSize: '1.5rem' }}>MindVerse</div>
      <Space size="large">
        <a href="#" style={{ color: 'white', fontWeight: 500 }}>Dashboard</a>
        <a href="#" style={{ color: 'white', fontWeight: 500 }}>Forum</a>
      </Space>
    </div>
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <Input.Search
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 400, borderRadius: 8 }}
      />
    </div>
    <Dropdown overlay={profileMenu} placement="bottomRight">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 24,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />
        <span style={{ color: 'white', fontWeight: 500 }}>John Doe</span>
      </div>
    </Dropdown>
  </div>
</Header>
      <Content style={{ padding: '2rem', minHeight: '100vh' }}>
        <div
          style={{
            width: '100%',
            color: 'white',
            minHeight: '100vh',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          }}
        >
          <Title style={{ color: 'white' }}>Community Forum</Title>
          <p style={{ color: '#d1d5db' }}>Share knowledge, ask questions, and connect with the community</p>
          <button
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 8,
              border: 'none',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: 16,
              textAlign: 'left',
              margin: '20px 0',
              cursor: 'pointer',
              fontFamily: 'Poppins',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.16)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onClick={() => navigate('/create')}
          >
            What do you want to share?
          </button>

          <Space direction="vertical" style={{ width: '100%' }}>
            {paginatedPosts.map(post => (
              <ForumPostCard key={post.id} post={post} onClick={(id) => navigate(`/forum/${id}`)} />
            ))}
          </Space>

          <Pagination
            current={currentPage}
            total={filteredPosts.length}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            style={{ marginTop: 20, textAlign: 'center' }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Forum;
