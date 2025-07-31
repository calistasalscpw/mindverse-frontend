import React from 'react';
import { Form, Input, DatePicker, Select, Button, Typography, Row, Col, Space } from 'antd'; 
import stickmanImage from "../assets/stickman.png";

const { Title } = Typography;

function TaskCreate({ form, onFinish, onCancel, submitting, teamMembers = [] }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      padding: '40px',
      width: '800px',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '30px',
      alignItems: 'center',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: '#E0E0E0',
      }}></div>

      <Title level={2} style={{ gridColumn: '1 / 2', marginTop: 0, color: '#333', marginLeft: '50px' }}>New Task</Title> 
      <p style={{ gridColumn: '1 / 2', color: '#666', marginBottom: '25px', marginLeft: '50px' }}>Add a new task to your project!</p>

      <Form
        form={form} 
        name="task_create_form"
        onFinish={onFinish} 
        layout="vertical"
        style={{
          gridColumn: '1 / 2',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginLeft: '50px',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Task Name*" name="name" rules={[{ required: true }]}>
              <Input placeholder="Task Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Deadline" name="dueDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Assign To*" name="assignTo" rules={[{ required: true }]}>
          <Select
            mode="multiple"
            placeholder="Assign To"
            allowClear
            options={teamMembers.map(user => ({ label: user.name, value: user._id }))}
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Description" autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                style={{
                    background: 'linear-gradient(to right, #8a2be2, #ff69b4)',
                    color: 'white', padding: '10px 25px', border: 'none',
                    borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold',
                    height: 'auto'
                }}>
              Add Task
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
      
      <div style={{ gridColumn: '2 / 3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={stickmanImage} alt="Illustration" style={{ maxWidth: '100%', height: 'auto' }} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x300/e0e0e0/ffffff?text=Image' }}/>
      </div>
    </div>
  );
}

export default TaskCreate;
