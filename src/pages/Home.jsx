import React, { useState } from 'react';
import { Layout, Card, Avatar, Button, Badge, Space, Typography, Dropdown, Menu } from 'antd';
import { PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

// Dummy data 
const teamMembers = [
  { name: 'Alice Smith', role: 'Project Manager', status: 'online', color: '#6366f1', initials: 'AS' },
  { name: 'Mike Johnson', role: 'Developer', status: 'online', color: '#8b5cf6', initials: 'MJ' },
  { name: 'Sarah Wilson', role: 'Designer', status: 'offline', color: '#06b6d4', initials: 'SW' },
];

const taskColumnsData = {
  'To Do': {
    color: '#ef4444', 
    tasks: [
      { id: 1, title: 'Update user authentication system', description: 'Implement OAuth 2.0 and improve security measures', dueDate: 'Due, Jan 28', members: ['MJ'], cardColor: '#fee2e2' },
      { id: 2, title: 'Design new landing page', description: 'Create wireframes and mockups for the new homepage', dueDate: 'Due, Jan 30', members: ['SW'], cardColor: '#fef3c7' },
      { id: 3, title: 'Write documentation', description: 'Update API documentation and user guides', dueDate: 'Due, Feb 2', members: ['AS'], cardColor: '#dbeafe' }
    ]
  },
  'In Progress': {
    color: '#f59e0b',
    tasks: [
      { id: 4, title: 'Database optimization', description: 'Improve query performance and indexing', dueDate: 'Due, Jan 25', members: ['MJ'], cardColor: '#fef3c7'},
      { id: 5, title: 'Mobile app testing', description: 'Test new features on iOS and Android', dueDate: 'Due, Feb 1', members: ['AS', 'SW'], cardColor: '#dbeafe'}
    ]
  },
  'Review': {
      color: '#8b5cf6',
      tasks: [
          { id: 6, title: 'Code review for payment system', description: 'Review security implementation and error handling', dueDate: 'Due, Jan 15', members: ['MJ'], cardColor: '#e9d5ff'},
          { id: 7, title: 'UI/UX design approval', description: 'Final review of dashboard redesign', dueDate: 'Due, Jan 27', members: ['AS', 'SW'], cardColor: '#dbeafe'}
      ]
  },
  'Done': {
      color: '#10b981',
      tasks: [
          { id: 8, title: 'User registration flow', description: 'Implemented email verification and onboarding', completedDate: 'Completed, Jan 15', members: ['MJ'], cardColor: '#d1fae5' },
          { id: 9, title: 'Email notification system', description: 'Set up automated email alerts for tasks', completedDate: 'Completed, Jan 17', members: ['AS'], cardColor: '#d1fae5'},
          { id: 10, title: 'Brand guidelines update', description: 'Updated logo and color scheme documentation', completedDate: 'Completed, Jan 21', members: ['SW'], cardColor: '#d1fae5'}
      ]
  }
};

// Helper to get member by initials
const getMemberByInitials = (initials) => teamMembers.find(m => m.initials === initials);

// Dropdown menu for each tasks
const TaskMenu = ({ taskId }) => (
  <Menu>
    <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => console.log('View task', taskId)}>
      View Details
    </Menu.Item>
    <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => console.log('Edit task', taskId)}>
      Edit Task
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => console.log('Delete task', taskId)}>
      Delete Task
    </Menu.Item>
  </Menu>
);

const Home = () => {
  const { Sider, Content } = Layout;
  const { Title, Text } = Typography;
  
  const [hoveredTask, setHoveredTask] = useState(null);
  const [taskColumns, setTaskColumns] = useState(taskColumnsData);

  const mainLayoutStyle = {
    minHeight: '100%',
    width: '100%',
    backgroundColor: '#F9FAFB',
    // overflow: 'hidden'
  };
  
  const siderStyle = {
    background: '#FFFFFF', 
    padding: '24px', 
    borderRight: '1px solid #e5e7eb',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden'
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', height: 'calc(100vh - 64px)' }}>
      <Layout style={mainLayoutStyle}>
        <Sider width={256} style={siderStyle}>
          <Title level={5} style={{ color: '#000', marginBottom: '16px' }}>Team Members</Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {teamMembers.map((member) => (
              <div key={member.name} style={{ display: 'flex', alignItems: 'center' }}>
                <Badge dot color={member.status === 'online' ? '#10b981' : '#d1d5db'} offset={[-5, 28]}>
                  <Avatar style={{ backgroundColor: member.color, color: 'white' }}>
                    {member.initials}
                  </Avatar>
                </Badge>
                <div style={{ marginLeft: '12px' }}>
                  <Text style={{ fontWeight: 500, color: '#000' }}>{member.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>{member.role}</Text>
                </div>
              </div>
            ))}
          </Space>
        </Sider>
        
        <Content style={{ padding: '24px' }}>
          <Title level={6} style={{ color: '#000' }}>Personal Dashboard</Title>
          <Text type="secondary">Manage your tasks and collaborate with your team</Text>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '16px', 
            marginTop: '24px',
            height: 'calc(100% - 120px)',
          }}>
            {Object.entries(taskColumns).map(([title, column]) => (
              <div key={title} style={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%',
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderBottom: `2px solid ${column.color}`, 
                  paddingBottom: '12px',
                  marginBottom: '16px',
                }}>
                  <Text strong style={{ color: '#000' }}>{title}</Text>
                  <Badge 
                    count={column.tasks.length} 
                    style={{ backgroundColor: column.color, color: 'white' }}
                  />
                </div>
                
                <Space direction="vertical" size="middle" style={{ 
                  width: '100%',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  flex: 1, 
                }}>
                  {column.tasks.map((task) => {
                    const isHovered = hoveredTask === task.id;
                    const cardStyle = {
                      backgroundColor: task.cardColor, 
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0',
                      boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 2px rgba(0,0,0,0.04)',
                      transform: isHovered ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer'
                    };

                    return (
                      <div
                        key={task.id}
                        onMouseEnter={() => setHoveredTask(task.id)}
                        onMouseLeave={() => setHoveredTask(null)}
                      >
                        <Card hoverable style={cardStyle} bodyStyle={{ padding: '12px' }}>
                          <Space direction="vertical" style={{width: '100%'}}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Text strong style={{ color: '#000', fontSize: '14px', flex: 1, marginRight: '8px' }}>
                                {task.title}
                              </Text>
                              <Dropdown overlay={<TaskMenu taskId={task.id} />} trigger={['click']} placement="bottomRight">
                                <Button
                                  type="text"
                                  size="small"
                                  icon={<MoreOutlined />}
                                  style={{
                                    opacity: isHovered ? 1 : 0,
                                    transition: 'opacity 0.2s ease-in-out',
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </Dropdown>
                            </div>
                            <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                              {task.description}
                            </Text>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                              <Avatar.Group maxCount={2} size="small">
                                {task.members.map(initials => {
                                  const member = getMemberByInitials(initials);
                                  return member ? (
                                    <Avatar key={initials} style={{ backgroundColor: member.color, color: 'white', fontSize: '10px' }}>
                                      {initials}
                                    </Avatar>
                                  ) : null;
                                })}
                              </Avatar.Group>
                              <Text type="secondary" style={{ fontSize: '11px', color: '#666' }}>
                                {task.dueDate || task.completedDate}
                              </Text>
                            </div>
                          </Space>
                        </Card>
                      </div>
                    );
                  })}
                  
                  <Button type="dashed" block icon={<PlusOutlined />} style={{ marginTop: 'auto' }}>
                    Add Task
                  </Button>
                </Space>
              </div>
            ))}
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
