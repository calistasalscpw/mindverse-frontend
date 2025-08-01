import React, { useState, useEffect } from 'react';
import { Layout, Card, Avatar, Button, Badge, Space, Typography, Dropdown, Menu, Spin, Form, message, Modal } from 'antd';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import API from '../api.js';

import TaskCreate from '../components/TaskCreate';
import TaskEdit from '../components/TaskEdit';

const getCardColorForStatus = (status) => {
    const colors = { 'To Do': '#fee2e2', 'In Progress': '#fef3c7', 'Review': '#e9d5ff', 'Done': '#d1fae5' };
    return colors[status] || '#f3f4f6';
};

const TaskMenu = ({ task, onEdit, onDelete }) => (
  <Menu>
    <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => console.log('View task', task.id)}>
      View Details
    </Menu.Item>
    <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => onEdit(task)}>
      Edit Task
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => onDelete(task.id)}>
      Delete Task
    </Menu.Item>
  </Menu>
);

const Home = () => {
  const { Sider, Content } = Layout;
  const { Title, Text } = Typography;
  const [form] = Form.useForm();

  const [taskColumns, setTaskColumns] = useState({ 'To Do': { color: '#ef4444', tasks: [] }, 'In Progress': { color: '#f59e0b', tasks: [] }, 'Review': { color: '#8b5cf6', tasks: [] }, 'Done': { color: '#10b981', tasks: [] } });
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null); 
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null); 

  const getMemberById = (id) => teamMembers.find(m => m._id === id);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, tasksResponse] = await Promise.all([
        API.get('/auth'), 
        API.get('/tasks')  
      ]);
      
      setTeamMembers(usersResponse.data);

      const newColumns = { 'To Do': { color: '#ef4444', tasks: [] }, 'In Progress': { color: '#f59e0b', tasks: [] }, 'Review': { color: '#8b5cf6', tasks: [] }, 'Done': { color: '#10b981', tasks: [] } };
      tasksResponse.data.forEach(task => {
        let status = task.progressStatus === "ToDo" ? "To Do" : task.progressStatus;
        if (newColumns[status]) {
          newColumns[status].tasks.push({
            id: task._id,
            title: task.name,
            description: task.description,
            dueDate: task.dueDate ? dayjs(task.dueDate).format('MMM D') : 'No date',
            members: task.assignTo,
            status: status,
            cardColor: getCardColorForStatus(status)
          });
        }
      });
      setTaskColumns(newColumns);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      message.error('Failed to load data. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setModalContent('create');
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setModalContent('edit');
    form.setFieldsValue({
      name: task.title,
      description: task.description,
      assignTo: task.members,
      dueDate: task.dueDate !== 'No date' ? dayjs(task.dueDate, 'MMM D') : null,
      progressStatus: task.status
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const payload = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null,
    };

    try {
      if (modalContent === 'create') {
        await API.post('/tasks', payload);
        message.success('Task created successfully!');
      } else {
        await API.put(`/tasks/${editingTask.id}`, payload);
        message.success('Task updated successfully!');
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'An error occured!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
        await API.delete(`/tasks/${taskId}`);
        message.success('Task deleted successfully!');
        fetchData();
    } catch (error) {
        message.error(error.response?.data?.message || 'Failed to delete task.');
    }
  };

  const showDeleteConfirm = (taskId) => {
    Modal.confirm({
        title: 'Are you sure you want to delete task?',
        content: 'This action can not be undone.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: () => handleDeleteTask(taskId),
    });
  };

  if (loading) { return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>; }

  return (
    <>
      <div style={{ fontFamily: 'Poppins, sans-serif', height: 'calc(100vh - 64px)' }}>
        <Layout style={{ minHeight: '100%', width: '100%', backgroundColor: '#F9FAFB' }}>
          <Sider width={256} style={{ background: '#FFFFFF', padding: '24px', borderRight: '1px solid #e5e7eb', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
            <Title level={5} style={{ color: '#000', marginBottom: '16px' }}>Team Members</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {teamMembers.map((member) => (
                <div key={member._id} style={{ display: 'flex', alignItems: 'center' }}>
                  <Badge dot color={member.status === 'online' ? '#10b981' : '#d1d5db'} offset={[-5, 28]}>
                    <Avatar style={{ backgroundColor: member.color || '#8b5cf6', color: 'white' }}>
                      {member.username ? member.username.match(/\b(\w)/g).join('') : 'U'}
                    </Avatar>
                  </Badge>
                  <div style={{ marginLeft: '12px' }}>
                    <Text style={{ fontWeight: 500, color: '#000' }}>{member.username}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>{member.role || 'Member'}</Text>
                  </div>
                </div>
              ))}
            </Space>
          </Sider>
          
          <Content style={{ padding: '24px' }}>
            <Title level={6} style={{ color: '#000' }}>Personal Dashboard</Title>
            <Text type="secondary">Manage your tasks and collaborate with your team</Text>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px', height: 'calc(100% - 120px)' }}>
              {Object.entries(taskColumns).map(([title, column]) => (
                <div key={title} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${column.color}`, paddingBottom: '12px', marginBottom: '16px' }}>
                    <Text strong style={{ color: '#000' }}>{title}</Text>
                    <Badge count={column.tasks.length} style={{ backgroundColor: column.color, color: 'white' }} />
                  </div>
                  
                  <Space direction="vertical" size="middle" style={{ width: '100%', overflowY: 'auto', overflowX: 'hidden', flex: 1 }}>
                    {column.tasks.map((task) => {
                      const isHovered = hoveredTask === task.id;
                      return (
                        <div key={task.id} onMouseEnter={() => setHoveredTask(task.id)} onMouseLeave={() => setHoveredTask(null)}>
                          <Card hoverable style={{ backgroundColor: task.cardColor, borderRadius: '8px', border: '1px solid #f0f0f0', boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.04)', transform: isHovered ? 'translateY(-2px)' : 'none', transition: 'all 0.2s ease-in-out', cursor: 'pointer' }} bodyStyle={{ padding: '12px' }}>
                            <Space direction="vertical" style={{width: '100%'}}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Text strong style={{ color: '#000', fontSize: '14px', flex: 1, marginRight: '8px' }}>{task.title}</Text>
                                <Dropdown overlay={<TaskMenu task={task} onEdit={handleOpenEditModal} onDelete={showDeleteConfirm} />} trigger={['click']} placement="bottomRight">
                                  <Button type="text" size="small" icon={<MoreOutlined />} style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }} onClick={(e) => e.stopPropagation()} />
                                </Dropdown>
                              </div>
                              <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.4' }}>{task.description}</Text>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                <Avatar.Group maxCount={2} size="small">
                                  {task.members.map(memberId => {
                                    const member = getMemberById(memberId);
                                    return member ? <Avatar key={memberId} style={{ backgroundColor: member.color || '#8b5cf6', color: 'white', fontSize: '10px' }}>{member.username ? member.username.match(/\b(\w)/g).join(''): 'U'}</Avatar> : null;
                                  })}
                                </Avatar.Group>
                                <Text type="secondary" style={{ fontSize: '11px', color: '#666' }}>{task.dueDate}</Text>
                              </div>
                            </Space>
                          </Card>
                        </div>
                      );
                    })}
                    <Button type="dashed" block icon={<PlusOutlined />} style={{ marginTop: 'auto' }} onClick={handleOpenCreateModal}>
                      Add Task
                    </Button>
                  </Space>
                </div>
              ))}
            </div>
          </Content>
        </Layout>
      </div>

      {isModalVisible && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div onClick={(e) => e.stopPropagation()}> 
            {modalContent === 'create' && (
              <TaskCreate
                form={form}
                onFinish={handleSubmit}
                onCancel={handleCancel}
                submitting={submitting}
                teamMembers={teamMembers}
              />
            )}
            {modalContent === 'edit' && (
              <TaskEdit 
                form={form} 
                initialData={editingTask} 
                onFinish={handleSubmit}
                onCancel={handleCancel}
                submitting={submitting}
                teamMembers={teamMembers}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
