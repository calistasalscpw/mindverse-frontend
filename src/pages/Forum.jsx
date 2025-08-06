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
  const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 5);

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
      setSearchParams({ keyword: searchTerm, page: currentPage, pageSize: pageSize });
  }, [currentPage, searchTerm, pageSize])

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
      <Content className="forum-content">
        <div className="forum-container">
          <div className="forum-header">
            <Title style={{ color: 'white' }} className="forum-title">Community Forum</Title>
            <p style={{ color: '#d1d5db' }} className="forum-description">
              Share knowledge, ask questions, and connect with the community
            </p>
          </div>

          <button
            className="share-button"
            onClick={() => setIsModalOpen(true)}
          >
            What do you want to share?
          </button>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px'}}>
              <Spin size='large'/>
            </div>
          ) : (
          <Space direction="vertical" style={{ width: '100%' }} className="posts-container">
            {posts.map(post => (
              <ForumPostCard key={post._id} post={post} onClick={(id) => navigate(`/forum/${id}`)} />
            ))}
          </Space>
          )}

          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={(page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              }}
              showSizeChanger={false}
              showQuickJumper={false}
              responsive={true}
            />
          </div>

          <Modal
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            centered
            closable={false}
            width={720}
            style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
            bodyStyle={{ background: '#1f1c3a', borderRadius: 16, padding: 0 }}
            className="create-post-modal"
          >
            <CreatePost 
              onSuccess={handlePostCreated}
              onClose={() => setIsModalOpen(false)} 
            />
          </Modal>
        </div>
      </Content>

      {/* Responsive CSS */}
      <style jsx>{`
        .forum-content {
          padding: 2rem;
          min-height: 100vh;
        }

        .forum-container {
          width: 100%;
          color: white;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          max-width: 1200px;
          margin: 0 auto;
        }

        .forum-header {
          margin-bottom: 24px;
        }

        .forum-title {
          margin-bottom: 8px !important;
          font-size: 32px !important;
        }

        .forum-description {
          font-size: 16px;
          margin-bottom: 0;
        }

        .share-button {
          width: 100%;
          padding: 16px;
          border-radius: 8px;
          border: none;
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 16px;
          text-align: left;
          margin: 20px 0;
          cursor: pointer;
          font-family: 'Poppins';
          transition: background 0.2s;
        }

        .share-button:hover {
          background: rgba(255,255,255,0.12);
        }

        .posts-container {
          margin-bottom: 32px;
        }

        .pagination-container {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }

        .create-post-modal .ant-modal-content {
          background: transparent !important;
          box-shadow: none !important;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .forum-content {
            padding: 1.5rem;
          }

          .forum-title {
            font-size: 28px !important;
          }

          .forum-description {
            font-size: 15px;
          }

          .share-button {
            padding: 14px;
            font-size: 15px;
          }

          .create-post-modal {
            width: 90% !important;
            max-width: 600px !important;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .forum-content {
            padding: 1rem;
          }

          .forum-header {
            margin-bottom: 20px;
          }

          .forum-title {
            font-size: 24px !important;
            margin-bottom: 6px !important;
          }

          .forum-description {
            font-size: 14px;
          }

          .share-button {
            padding: 12px;
            font-size: 14px;
            margin: 16px 0;
            border-radius: 6px;
          }

          .posts-container {
            margin-bottom: 24px;
          }

          .pagination-container {
            margin-top: 16px;
          }

          .create-post-modal {
            width: 95% !important;
            margin: 0 !important;
            max-width: none !important;
          }

          .create-post-modal .ant-modal-body {
            padding: 0 !important;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .forum-content {
            padding: 0.75rem;
          }

          .forum-header {
            margin-bottom: 16px;
          }

          .forum-title {
            font-size: 22px !important;
          }

          .forum-description {
            font-size: 13px;
          }

          .share-button {
            padding: 10px;
            font-size: 13px;
            margin: 12px 0;
          }

          .posts-container {
            margin-bottom: 20px;
          }

          .create-post-modal {
            width: 98% !important;
            max-height: 95vh !important;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .forum-content {
            padding: 0.5rem;
          }

          .forum-title {
            font-size: 20px !important;
          }

          .forum-description {
            font-size: 12px;
          }

          .share-button {
            padding: 8px;
            font-size: 12px;
          }
        }

        /* Pagination responsive styles */
        @media (max-width: 768px) {
          .pagination-container .ant-pagination {
            font-size: 14px;
          }
          
          .pagination-container .ant-pagination-item {
            min-width: 28px;
            height: 28px;
            line-height: 26px;
            margin-right: 4px;
          }
          
          .pagination-container .ant-pagination-prev,
          .pagination-container .ant-pagination-next {
            min-width: 28px;
            height: 28px;
            line-height: 26px;
          }
        }

        @media (max-width: 480px) {
          .pagination-container .ant-pagination {
            font-size: 12px;
          }
          
          .pagination-container .ant-pagination-item {
            min-width: 24px;
            height: 24px;
            line-height: 22px;
            margin-right: 2px;
          }
          
          .pagination-container .ant-pagination-prev,
          .pagination-container .ant-pagination-next {
            min-width: 24px;
            height: 24px;
            line-height: 22px;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Forum;