import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Layout, Card, Avatar, Button, Badge, Space, Typography, Dropdown, Spin, Form, message, Modal, Descriptions, Tag, Drawer } from 'antd';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons'; // Add CalendarOutlined
import dayjs from 'dayjs';
import API from '../api.js';

import TaskCreate from '../components/TaskCreate';
import TaskEdit from '../components/TaskEdit';
import SmartMeetingScheduler from '../components/SmartMeetingScheduler'; // Add Smart Meeting component
import { useAuth } from '../context/AuthContext';

// --- Helper functions for styling and menu creation ---
const getStatusTagColor = (status) => {
  const colors = { 'To Do': 'red', 'In Progress': 'gold', 'Review': 'purple', 'Done': 'green' };
  return colors[status] || 'default';
};

const getCardColorForStatus = (status) => {
  const colors = { 'To Do': '#fee2e2', 'In Progress': '#fef3c7', 'Review': '#e9d5ff', 'Done': '#d1fae5' };
  return colors[status] || '#f3f4f6';
};

const getTaskMenuItems = (task, onEdit, onDelete, onView, onScheduleMeeting, user) => { // Add onScheduleMeeting parameter
  const items = [
    { key: 'view', label: 'View Details', icon: <EyeOutlined />, onClick: () => onView(task) }
  ]
  
  if (user?.isLead || user?.isHR) {
    items.push(
      { key: 'edit', label: 'Edit Task', icon: <EditOutlined />, onClick: () => onEdit(task) },
      { type: 'divider' },
      // Add Smart Meeting option - only for tasks that are not Done
      ...(task.status !== 'Done' ? [{
        key: 'meeting', 
        label: 'Schedule Smart Meeting', 
        icon: <CalendarOutlined />, 
        onClick: () => onScheduleMeeting(task)
      }] : []),
      { type: 'divider' },
      { key: 'delete', label: 'Delete Task', icon: <DeleteOutlined />, danger: true, onClick: () => onDelete(task.id) },
    );
  }
  return items;
};

const Home = () => {
  const { Sider, Content } = Layout;
  const { Title, Text } = Typography;

  const [form] = Form.useForm();
  const { user, loading: authLoading } = useAuth();

  // --- Component state ---
  const [taskColumns, setTaskColumns] = useState({ 'To Do': { name: 'To Do', color: '#ef4444', tasks: [] }, 'In Progress': { name: 'In Progress', color: '#f59e0b', tasks: [] }, 'Review': { name: 'Review', color: '#8b5cf6', tasks: [] }, 'Done': { name: 'Done', color: '#10b981', tasks: [] } });
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null); 
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null); 
  const [submitting, setSubmitting] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [teamSidebarOpen, setTeamSidebarOpen] = useState(false);

  // Add Smart Meeting states
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [selectedTaskForMeeting, setSelectedTaskForMeeting] = useState(null);

  // --- Data fetching and side effects ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, tasksResponse] = await Promise.all([ API.get('/auth'), API.get('/tasks') ]);
      setTeamMembers(usersResponse.data);

      const newColumns = { 'To Do': { name: 'To Do', color: '#ef4444', tasks: [] }, 'In Progress': { name: 'In Progress', color: '#f59e0b', tasks: [] }, 'Review': { name: 'Review', color: '#8b5cf6', tasks: [] }, 'Done': { name: 'Done', color: '#10b981', tasks: [] } };
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
      message.error('Failed to load data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Check screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
        setTeamSidebarOpen(false); // Close team sidebar on desktop
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Event handlers for tasks, modals, and drag-and-drop ---
  const getMemberById = (id) => teamMembers.find(m => m._id === id);

  const getRoleName = (member) => {
    if (member.isLead) return 'Lead';
    if (member.isHR) return 'HR';
    return 'Member';
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const backendStatus = newStatus === 'To Do' ? 'ToDo' : newStatus;

    try {
      await API.patch(`/tasks/${taskId}/status`, { progressStatus: backendStatus });
    } catch (error) {
      message.error('Failed to update task status. Reverting changes.');
      fetchData();
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    if (sourceColId === destColId && source.index === destination.index) return;

    const startCol = taskColumns[sourceColId];
    const endCol = taskColumns[destColId];
    
    const startTasks = Array.from(startCol.tasks);
    const [removed] = startTasks.splice(source.index, 1);
    const newColumnsState = { ...taskColumns };

    if (sourceColId === destColId) {
      startTasks.splice(destination.index, 0, removed);
      newColumnsState[sourceColId] = { ...startCol, tasks: startTasks };
    } else {
      const endTasks = Array.from(endCol.tasks);
      const updatedTask = { ...removed, status: destColId, cardColor: getCardColorForStatus(destColId) };
      endTasks.splice(destination.index, 0, updatedTask);
      newColumnsState[sourceColId] = { ...startCol, tasks: startTasks };
      newColumnsState[destColId] = { ...endCol, tasks: endTasks };
      
      handleUpdateTaskStatus(removed.id, destColId);
    }
    setTaskColumns(newColumnsState);
  };

  const handleOpenCreateModal = () => { setModalContent('create'); form.resetFields(); setIsModalVisible(true); };
  const handleOpenEditModal = (task) => { setEditingTask(task); setModalContent('edit'); form.setFieldsValue({ name: task.title, description: task.description, assignTo: task.members, dueDate: task.dueDate !== 'No date' ? dayjs(task.dueDate, 'MMM D') : null, progressStatus: task.status }); setIsModalVisible(true); };
  const handleOpenViewModal = (task) => { setViewingTask(task); setModalContent('view'); setIsModalVisible(true); };
  const handleCancel = () => { setIsModalVisible(false); setEditingTask(null); setViewingTask(null); };

  // Add Smart Meeting handlers
  const handleScheduleMeeting = (task) => {
    setSelectedTaskForMeeting(task);
    setMeetingModalVisible(true);
  };

  const handleCloseMeetingModal = () => {
    setMeetingModalVisible(false);
    setSelectedTaskForMeeting(null);
  };

  const handleSubmit = async (values) => { 
    setSubmitting(true);
    const payload = { ...values, dueDate: values.dueDate ? values.dueDate.toISOString() : null };
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
      message.error(error.response?.data?.message || 'An error occurred!');
      message.error(error.message)
    } finally {
      setSubmitting(false);
    }
  };
  
  const showDeleteConfirm = (taskId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleDeleteTask(taskId),
    });
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
  
  // --- Main component render ---
  if (loading || authLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  return (
    <>
      <div style={{ fontFamily: 'Poppins, sans-serif', height: 'calc(100vh - 64px)' }}>
        <Layout style={{ minHeight: '100%', width: '100%', backgroundColor: '#F9FAFB' }}>
          {/* Desktop Team Sidebar */}
          <Sider 
            width={256} 
            collapsed={sidebarCollapsed}
            collapsible={false}
            trigger={null}
            style={{ 
              background: '#FFFFFF', 
              padding: sidebarCollapsed ? '12px' : '24px', 
              borderRight: '1px solid #e5e7eb', 
              height: 'calc(100vh - 64px)', 
              overflowY: 'auto',
              position: 'relative'
            }}
            className="team-sidebar"
          >
            {!sidebarCollapsed && (
              <>
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
                        <Text style={{ fontWeight: 500, color: '#000', fontSize: '14px' }}>{member.username}</Text><br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>{getRoleName(member)}</Text>
                      </div>
                    </div>
                  ))}
                </Space>
              </>
            )}
            {sidebarCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                {teamMembers.slice(0, 4).map((member) => (
                  <Badge key={member._id} dot color={member.status === 'online' ? '#10b981' : '#d1d5db'} offset={[-2, 6]}>
                    <Avatar 
                      style={{ backgroundColor: member.color || '#8b5cf6', color: 'white' }}
                      size="small"
                      title={member.username}
                    >
                      {member.username ? member.username.match(/\b(\w)/g).join('') : 'U'}
                    </Avatar>
                  </Badge>
                ))}
                {teamMembers.length > 4 && (
                  <Avatar size="small" style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
                    +{teamMembers.length - 4}
                  </Avatar>
                )}
              </div>
            )}
          </Sider>

          {/* Mobile Team Members Trigger Button */}
          <Button
            type="primary"
            shape="circle"
            icon={<UserOutlined />}
            onClick={() => setTeamSidebarOpen(true)}
            className="mobile-team-button"
            title="View Team Members"
          />

          {/* Mobile Team Members Sidebar */}
          <Drawer
            title="Team Members"
            placement="right"
            closable={true}
            onClose={() => setTeamSidebarOpen(false)}
            open={teamSidebarOpen}
            width={300}
            bodyStyle={{
              background: "#FFFFFF",
              padding: "20px",
            }}
            headerStyle={{
              background: "#FFFFFF",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {teamMembers.map((member) => (
                <div key={member._id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
                  <Badge dot color={member.status === 'online' ? '#10b981' : '#d1d5db'} offset={[-5, 28]}>
                    <Avatar 
                      style={{ backgroundColor: member.color || '#8b5cf6', color: 'white' }}
                      size={40}
                    >
                      {member.username ? member.username.match(/\b(\w)/g).join('') : 'U'}
                    </Avatar>
                  </Badge>
                  <div style={{ marginLeft: '12px' }}>
                    <Text style={{ fontWeight: 500, color: '#000', fontSize: '15px', display: 'block' }}>
                      {member.username}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>
                      {getRoleName(member)}
                    </Text>
                  </div>
                </div>
              ))}
            </Space>
          </Drawer>
          
          <Content style={{ padding: '16px', minHeight: '100%' }} className="main-content">
            <div className="content-header" style={{ marginBottom: '20px' }}>
              <Title level={5} style={{ color: '#000', margin: 0 }}>Personal Dashboard</Title>
              <Text type="secondary">Manage your tasks and collaborate with your team</Text>
            </div>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="kanban-board">
                {Object.entries(taskColumns).map(([columnId, column]) => (
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="kanban-column"
                        style={{ 
                          backgroundColor: '#FFFFFF', 
                          borderRadius: '12px', 
                          padding: '16px', 
                          border: snapshot.isDraggingOver ? `2px dashed ${column.color}` : '1px solid #f0f0f0', 
                          display: 'flex', 
                          flexDirection: 'column',
                          height: 'fit-content',
                          minHeight: '400px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${column.color}`, paddingBottom: '12px', marginBottom: '16px' }}>
                          <Text strong style={{ color: '#000', fontSize: '14px' }}>{column.name}</Text>
                          <Badge count={column.tasks.length} style={{ backgroundColor: column.color, color: 'white' }} />
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', minHeight: '100px', paddingRight: '4px' }}>
                          {column.tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{ userSelect: 'none', marginBottom: '8px', ...provided.draggableProps.style }}
                                  onMouseEnter={() => setHoveredTask(task.id)}
                                  onMouseLeave={() => setHoveredTask(null)}
                                >
                                  <Card
                                    hoverable
                                    styles={{ body: { padding: '12px' } }}
                                    style={{ 
                                      backgroundColor: task.cardColor, 
                                      borderRadius: '8px', 
                                      boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.2)' : (hoveredTask === task.id ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.04)'), 
                                      transition: 'all 0.2s ease-in-out', 
                                      cursor: 'grab' 
                                    }}
                                  >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Text strong style={{ color: '#000', fontSize: '13px', flex: 1, marginRight: '8px', lineHeight: '1.3' }}>{task.title}</Text>
                                        <Dropdown
                                          menu={{ items: getTaskMenuItems(task, handleOpenEditModal, showDeleteConfirm, handleOpenViewModal, handleScheduleMeeting, user) }} // Add handleScheduleMeeting parameter
                                          trigger={['click']}
                                          placement="bottomRight"
                                        >
                                          <Button type="text" size="small" icon={<MoreOutlined />} style={{ opacity: hoveredTask === task.id || snapshot.isDragging ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }} onClick={(e) => e.stopPropagation()} />
                                        </Dropdown>
                                      </div>
                                      {task.description && (
                                        <Text type="secondary" style={{ fontSize: '11px', lineHeight: '1.3' }}>
                                          {task.description.length > 60 ? `${task.description.substring(0, 60)}...` : task.description}
                                        </Text>
                                      )}
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                        <Avatar.Group max={{ count: 2 }} size="small">
                                          {task.members.map(memberId => {
                                            const member = getMemberById(memberId);
                                            return member ? <Avatar key={memberId} style={{ backgroundColor: member.color || '#8b5cf6', color: 'white', fontSize: '10px' }}>{member.username ? member.username.match(/\b(\w)/g).join('') : 'U'}</Avatar> : null;
                                          })}
                                        </Avatar.Group>
                                        <Text type="secondary" style={{ fontSize: '10px', color: '#666' }}>{task.dueDate}</Text>
                                      </div>
                                    </Space>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {(user?.isLead || user?.isHR) && (
                            <Button 
                              type="dashed" 
                              block 
                              icon={<PlusOutlined />} 
                              style={{ marginTop: '8px', flexShrink: 0, fontSize: '12px', height: '36px' }} 
                              onClick={handleOpenCreateModal}
                            >
                              Add Task
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </Content>
        </Layout>
      </div>
      
      {/* Modal rendering */}
      {isModalVisible && (
        <div className="modal-overlay">
          <div onClick={(e) => e.stopPropagation()}> 
            {modalContent === 'create' && (<TaskCreate form={form} onFinish={handleSubmit} onCancel={handleCancel} submitting={submitting} teamMembers={teamMembers} />)}
            {modalContent === 'edit' && (<TaskEdit form={form} initialData={editingTask} onFinish={handleSubmit} onCancel={handleCancel} submitting={submitting} teamMembers={teamMembers} />)}
            {modalContent === 'view' && viewingTask && (
              <div className="task-view-modal">
                <Title level={3} style={{ marginTop: 0 }}>{viewingTask.title}</Title>
                <Descriptions bordered column={1} size="small" style={{ marginTop: '24px' }}>
                  <Descriptions.Item label="Status"><Tag color={getStatusTagColor(viewingTask.status)}>{viewingTask.status}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Deadline">{viewingTask.dueDate !== 'No date' ? dayjs(viewingTask.dueDate, 'MMM D').format('dddd, D MMMM YYYY') : 'Not set'}</Descriptions.Item>
                  <Descriptions.Item label="Description">{viewingTask.description || <Text type="secondary">No description provided.</Text>}</Descriptions.Item>
                  <Descriptions.Item label="Assigned To">
                    <Avatar.Group max={{ count: 2 }}>
                      {viewingTask.members.map(memberId => {
                        const member = getMemberById(memberId);
                        return member ? (<Avatar key={memberId} style={{ backgroundColor: member.color || '#8b5cf6' }}>{member.username ? member.username.charAt(0).toUpperCase() : 'U'}</Avatar>) : null;
                      })}
                    </Avatar.Group>
                  </Descriptions.Item>
                </Descriptions>
                <div style={{ textAlign: 'right', marginTop: '24px' }}><Button onClick={handleCancel}>Close</Button></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Smart Meeting Modal */}
      <SmartMeetingScheduler
        visible={meetingModalVisible}
        onClose={handleCloseMeetingModal}
        task={selectedTaskForMeeting}
        user={user}
      />

      {/* CSS */}
      <style jsx>{`
        /* Mobile Team Button - Only visible on mobile */
        .mobile-team-button {
          position: fixed !important;
          top: 80px !important;
          right: 16px !important;
          z-index: 999 !important;
          background-color: #8b5cf6 !important;
          border-color: #8b5cf6 !important;
          width: 48px !important;
          height: 48px !important;
          display: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }

        /* Kanban Board Styles */
        .kanban-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          height: calc(100vh - 180px);
          overflow-x: auto;
          padding-bottom: 16px;
        }

        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
          box-sizing: border-box;
        }

        .task-view-modal {
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          padding: 40px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .kanban-board {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            height: auto;
            min-height: calc(100vh - 180px);
          }

          .kanban-column {
            min-height: 300px !important;
          }

          .team-sidebar {
            width: 200px !important;
          }

          .main-content {
            padding: 12px !important;
          }

          .task-view-modal {
            padding: 24px;
            margin: 10px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .mobile-team-button {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .team-sidebar {
            display: none !important;
          }

          .kanban-board {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 0 8px;
            height: auto;
            min-height: calc(100vh - 160px);
          }

          .kanban-column {
            min-height: 250px !important;
            padding: 12px !important;
          }

          .main-content {
            padding: 8px !important;
            margin-left: 0 !important;
          }

          .modal-overlay {
            padding: 10px;
          }

          .task-view-modal {
            padding: 16px;
            border-radius: 12px;
            max-height: 95vh;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .mobile-team-button {
            width: 44px !important;
            height: 44px !important;
            top: 76px !important;
            right: 12px !important;
          }

          .kanban-board {
            padding: 0 4px;
            gap: 8px;
          }

          .kanban-column {
            padding: 8px !important;
            min-height: 200px !important;
          }

          .main-content {
            padding: 4px !important;
          }

          .task-view-modal {
            padding: 12px;
            width: calc(100vw - 20px);
          }
        }
      `}</style>
    </>
  );
};

export default Home;