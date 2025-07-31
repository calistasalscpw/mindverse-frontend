import React from 'react';
import { Form, Input, DatePicker, Select, Button, Typography, Row, Col } from 'antd'; 
import stickman2Image from "../assets/stickaman2.png";


const { Option } = Select;
const { Title } = Typography;

function TaskEdit() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    //(API)
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'center',    
      minHeight: '100vh',       
      backgroundColor: '#f0f2f5', 
    }}>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        padding: '40px',
        width: '800px', 
        display: 'grid',
        gridTemplateColumns: '2fr 1fr', 
        gap: '30px', 
        alignItems: 'center',
        position: 'relative', 
      }}>
        {/* Lingkaran abu-abu di kiri atas kartu */}
        <div style={{
          position: 'absolute',
          top: '20px', 
          left: '20px', 
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: '#E0E0E0', 
        }}></div>

        <Title level={2} style={{ gridColumn: '1 / 2', marginTop: 0, color: '#333', marginLeft: '50px' }}>Edit Task</Title> 
        <p style={{ gridColumn: '1 / 2', color: '#666', marginBottom: '25px', marginLeft: '50px' }}>Edit The Task!</p>

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
          {/* Baris untuk Task Name dan Deadline (bersebelahan) */}
          <Row gutter={16}> 
            <Col span={12}>
              <Form.Item
                label="Task Name*"
                name="taskName"
                rules={[{ required: true, message: 'Please input your Task Name!' }]}
              >
                <Input placeholder="Task Name" />
              </Form.Item>
            </Col>
            <Col span={12}> 
              <Form.Item
                label="Deadline"
                name="deadline"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Assign To */}
          <Form.Item
            label="Assign To*"
            name="assignTo"
            rules={[{ required: true, message: 'Please select an assignee!' }]}
          >
            <Select
              placeholder="Assign To"
              allowClear
            >
              <Option value="alexsmith">Alex Smith</Option>
              <Option value="mikejohnson">Mike Johnson</Option>
              <Option value="sarahwilson">Sarah Wilson</Option>
            </Select>
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea placeholder="Description" autoSize={{ minRows: 3, maxRows: 6 }} />
          </Form.Item>

          {/* Tombol Submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{
              background: 'linear-gradient(to right, #8a2be2, #ff69b4)', 
              color: 'white',
              padding: '12px 25px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease',
              marginTop: '20px',
              alignSelf: 'flex-start',
            }}>
              Save Task
            </Button>
          </Form.Item>
        </Form>

        {/* Gambar stick figure */}
        <div style={{ 
          gridColumn: '2 / 3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <img src={stickman2Image} alt="Todo List Illustration" style={{ 
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
          }} />
        </div>
      </div>
    </div>
  );
}

export default TaskEdit;