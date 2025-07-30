import React, { useState } from 'react';
import { Button, Input, Typography, Pagination, Layout, Space, Dropdown, Avatar, Menu, Modal } from 'antd';
import ForumPostCard from '../components/ForumPostCard';
import CreatePost from './CreatePost';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <Menu>
      <Menu.Item key="profile" onClick={() => {}}>Profile</Menu.Item>
      <Menu.Item key="logout" onClick={() => {}}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Poppins', background: '#0f0c2a' }}>
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
  style={{
    width: 700,
    borderRadius: 8,
    background: '#1f1c3a',
    color: 'white',
    border: 'none',
  }}
  inputStyle={{
    background: '#1f1c3a',
    color: 'white',
    border: 'none',
  }}
/>
    </div>
    <Dropdown overlay={profileMenu} placement="bottomRight" trigger={['click']}>
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
        <Avatar src="" />
        <span style={{ color: 'white', fontWeight: 500 }}>Ayamn</span>
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
            onClick={() => setIsModalOpen(true)}
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
  style={{
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
/>
          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            centered
            width={720}
            style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
            bodyStyle={{ background: '#1f1c3a', borderRadius: 16, padding: 0 }}
            modalRender={modal => (
              <div style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
                {modal}
              </div>
            )}
          >
            <CreatePost onSuccess={() => setIsModalOpen(false)} />
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default Forum;
