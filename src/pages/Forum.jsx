import React, { useState, useEffect } from 'react';
import { Button, Input, Typography, Pagination, Layout, Space, Modal, Spin } from 'antd';
import ForumPostCard from '../components/ForumPostCard';
import CreatePost from './CreatePost';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api';

const { Content } = Layout;
const { Title } = Typography;

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const pageSize = 5;

  const fetchPosts = async () => {
    setLoading(true);
    try{
      const response = await API.get(`/forum?keyword=${searchTerm}&page=${currentPage}&pageSize=${pageSize}`);
      setPosts(response.data.data);
      setTotal(response.data.total);
    } catch (error){
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchPosts();
      setSearchParams({ keyword: searchTerm, page: currentPage});
  }, [searchTerm, currentPage, pageSize])

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); 
  };

  const handlePostCreated = () => {
    setIsModalOpen(false);
    if (currentPage !== 1){
      setCurrentPage(1);
    } else {
      fetchPosts();
    }
    setSearchTerm('');
  };

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Poppins', background: '#0f0c2a' }}>
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
          <p style={{ color: '#d1d5db' }}>
            Share knowledge, ask questions, and connect with the community
          </p>

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
            onClick={() => setIsModalOpen(true)}
          >
            What do you want to share?
          </button>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px'}}>
              <Spin size='large'/>
            </div>
          ) : (
          <Space direction="vertical" style={{ width: '100%' }}>
            {posts.map(post => (
              <ForumPostCard key={post._id} post={post} onClick={(id) => navigate(`/forum/${id}`)} />
            ))}
          </Space>
          )}

          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            style={{
              marginTop: 20,
              display: 'flex',
              justifyContent: 'center'
            }}
          />

          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            centered
            closable={false}
            width={720}
            style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
            bodyStyle={{ background: '#1f1c3a', borderRadius: 16, padding: 0 }}
            // modalRender={modal => (
            //   <div style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
            //     {modal}
            //   </div>
            // )}
          >
            <CreatePost 
              onSuccess={handlePostCreated}
              onClose={() => setIsModalOpen(false)} 
            />
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default Forum; 