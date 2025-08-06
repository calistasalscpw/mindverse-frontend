import React from 'react';
import { Form, Input, DatePicker, Select, Button, Typography, Row, Col, Space } from 'antd'; 
import stickmanImage from "../assets/stickman.png";
import chatbotGif from "../assets/ChatBot.gif"; 

const { Title } = Typography;

function TaskEdit({ form, onFinish, onCancel, submitting, teamMembers = [] }) {
  return (
    <div className="task-edit-container">
      <div className="chatbot-icon">
        <img src={chatbotGif} alt="ChatBot" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/40x40/e0e0e0/ffffff?text=ChatBot'; }} />
      </div>

      <div className="task-form-section">
        <Title level={2} className="task-title">Edit Task</Title> 
        <p className="task-description">Edit task to your project!</p>

        <Form
          form={form} 
          name="task_edit_form"
          onFinish={onFinish} 
          layout="vertical"
          className="task-form"
        >
          <Row gutter={16} className="form-row">
            <Col span={12} xs={24} sm={12}>
              <Form.Item label="Task Name" name="name" rules={[{ required: true }]}>
                <Input placeholder="Task Name" />
              </Form.Item>
            </Col>
            <Col span={12} xs={24} sm={12}>
              <Form.Item label="Deadline" name="dueDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Assign To" name="assignTo" rules={[{ required: true }]}> 
            <Select
              mode="multiple"
              placeholder="Assign To"
              allowClear
              options={teamMembers.map(user => ({ label: `${user.username} (${user.email})`, value: user._id }))}
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Description" autoSize={{ minRows: 3, maxRows: 6 }} />
          </Form.Item>

          <Form.Item>
            <Space className="button-group">
              <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={submitting}
                  className="submit-button"
              >
                Edit Task
              </Button>
              <Button onClick={onCancel} className="cancel-button">
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      
      <div className="illustration-section">
        <img src={stickmanImage} alt="Illustration" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x300/e0e0e0/ffffff?text=Image' }}/>
      </div>

      {/* Responsive CSS */}
      <style jsx>{`
        .task-edit-container {
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          padding: 40px;
          width: 800px;
          max-width: 90vw;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          align-items: center;
          position: relative;
          box-sizing: border-box;
        }

        .chatbot-icon {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          z-index: 10;
        }

        .chatbot-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .task-form-section {
          grid-column: 1 / 2;
          margin-left: 50px;
        }

        .task-title {
          margin-top: 0 !important;
          color: #333 !important;
          font-size: 32px !important;
        }

        .task-description {
          color: #666;
          margin-bottom: 25px;
          font-size: 16px;
        }

        .task-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-row {
          margin-bottom: 0;
        }

        .button-group {
          width: 100%;
          justify-content: flex-start;
        }

        .submit-button {
          background: linear-gradient(to right, #8a2be2, #ff69b4) !important;
          color: white !important;
          padding: 10px 25px !important;
          border: none !important;
          border-radius: 10px !important;
          font-size: 1rem !important;
          font-weight: bold !important;
          height: auto !important;
        }

        .cancel-button {
          border-radius: 10px !important;
          padding: 10px 25px !important;
          height: auto !important;
        }

        .illustration-section {
          grid-column: 2 / 3;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .illustration-section img {
          max-width: 100%;
          height: auto;
          max-height: 300px;
        }

        /* Tablet Styles */
        @media (max-width: 1024px) {
          .task-edit-container {
            width: 700px;
            padding: 32px;
            gap: 24px;
          }

          .task-form-section {
            margin-left: 40px;
          }

          .task-title {
            font-size: 28px !important;
          }

          .task-description {
            font-size: 15px;
          }

          .illustration-section img {
            max-height: 250px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .task-edit-container {
            width: 95vw;
            max-width: 500px;
            padding: 24px;
            gap: 0;
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
          }

          .chatbot-icon {
            top: 16px;
            left: 16px;
            width: 32px;
            height: 32px;
          }

          .task-form-section {
            grid-column: 1;
            grid-row: 1;
            margin-left: 0;
            margin-top: 20px;
          }

          .task-title {
            font-size: 24px !important;
            text-align: center;
          }

          .task-description {
            font-size: 14px;
            text-align: center;
            margin-bottom: 20px;
          }

          .form-row {
            margin-bottom: 16px;
          }

          .button-group {
            justify-content: center;
            gap: 12px;
          }

          .submit-button,
          .cancel-button {
            width: 120px;
            font-size: 14px !important;
            padding: 8px 16px !important;
          }

          .illustration-section {
            grid-column: 1;
            grid-row: 2;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
          }

          .illustration-section img {
            max-height: 150px;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .task-edit-container {
            width: 98vw;
            padding: 16px;
            border-radius: 16px;
          }

          .chatbot-icon {
            top: 12px;
            left: 12px;
            width: 28px;
            height: 28px;
          }

          .task-form-section {
            margin-top: 16px;
          }

          .task-title {
            font-size: 22px !important;
            margin-bottom: 8px !important;
          }

          .task-description {
            font-size: 13px;
            margin-bottom: 16px;
          }

          .task-form {
            gap: 12px;
          }

          .form-row {
            margin-bottom: 12px;
          }

          .button-group {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .submit-button,
          .cancel-button {
            width: 100%;
            max-width: 200px;
            font-size: 13px !important;
          }

          .illustration-section {
            margin-top: 16px;
            padding-top: 16px;
          }

          .illustration-section img {
            max-height: 120px;
          }
        }

        /* Extra Small Mobile */
        @media (max-width: 360px) {
          .task-edit-container {
            padding: 12px;
            border-radius: 12px;
          }

          .task-title {
            font-size: 20px !important;
          }

          .task-description {
            font-size: 12px;
          }

          .submit-button,
          .cancel-button {
            font-size: 12px !important;
            padding: 6px 12px !important;
          }

          .illustration-section img {
            max-height: 100px;
          }
        }

        /* Form Input Responsive Styles */
        @media (max-width: 768px) {
          .task-form .ant-form-item-label > label {
            font-size: 14px;
          }

          .task-form .ant-input,
          .task-form .ant-select,
          .task-form .ant-picker {
            font-size: 14px;
          }

          .task-form .ant-input,
          .task-form .ant-select-selector,
          .task-form .ant-picker {
            height: 36px;
          }

          .task-form .ant-input[placeholder] {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .task-form .ant-form-item-label > label {
            font-size: 13px;
          }

          .task-form .ant-input,
          .task-form .ant-select,
          .task-form .ant-picker {
            font-size: 13px;
          }

          .task-form .ant-input,
          .task-form .ant-select-selector,
          .task-form .ant-picker {
            height: 34px;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .submit-button,
          .cancel-button {
            min-height: 44px;
            padding: 12px 20px !important;
          }

          .task-form .ant-input,
          .task-form .ant-select-selector,
          .task-form .ant-picker {
            min-height: 40px;
          }
        }

        /* Landscape mobile optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          .task-edit-container {
            max-height: 90vh;
            overflow-y: auto;
            grid-template-columns: 1fr;
          }

          .illustration-section {
            display: none;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .task-edit-container {
            border: 2px solid #000;
          }

          .task-title {
            color: #000 !important;
          }

          .task-description {
            color: #000;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .submit-button,
          .cancel-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default TaskEdit;