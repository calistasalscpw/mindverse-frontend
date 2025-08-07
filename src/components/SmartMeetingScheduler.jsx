import React, { useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, TimePicker, Select, Card, Tag, Steps, message, Space, Typography, List, Divider, Alert } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined, BulbOutlined, GoogleOutlined, VideoCameraOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import API from '../api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const SmartMeetingScheduler = ({ 
  visible, 
  onClose, 
  task, 
  user 
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);

  // AI Analysis
  const analyzeTask = async () => {
    if (!task) return;
    
    setLoading(true);
    try {
      const response = await API.post('/meetings/analyze-task', {
        taskId: task.id
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.analysis) {
        const analysisData = response.data.analysis;
        console.log('Analysis Data:', analysisData);
        
        setAnalysis(analysisData);
        
        // Pre-fill form with AI suggestions
        const formattedAgenda = Array.isArray(analysisData.agenda) 
          ? '• ' + analysisData.agenda.join('\n• ')
          : analysisData.agenda || '';

        form.setFieldsValue({
          meetingTitle: analysisData.suggested_title || `Meeting for ${task.title}`,
          duration: analysisData.suggested_duration || 30,
          meetingDate: analysisData.suggested_date ? 
            dayjs(analysisData.suggested_date) : dayjs().add(1, 'day'),
          meetingTime: dayjs('10:00', 'HH:mm'),
          meetingType: 'google-meet',
          agenda: formattedAgenda
        });
        
        setCurrentStep(1);
        message.success('🤖 AI Analysis completed! Recommendations generated from OpenAI.');
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (error) {
      console.error('API Error:', error);
      message.error('Failed to analyze task. Please check your API connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const [meetingResponse, setMeetingResponse] = useState(null);

  // Schedule Meeting
  const scheduleMeeting = async (values) => {
    setSchedulingMeeting(true);
    try {
      const meetingData = {
        taskId: task.id,
        meetingTitle: values.meetingTitle,
        meetingDate: values.meetingDate.format('YYYY-MM-DD'),
        meetingTime: values.meetingTime.format('HH:mm'),
        duration: values.duration,
        agenda: values.agenda,
        meetingType: values.meetingType
      };

      const response = await API.post('/meetings/schedule', meetingData);
      
      if (response.data.success) {
        setMeetingResponse(response.data);
        setCurrentStep(2);
        message.success('Meeting scheduled successfully! Invitations have been sent.');
      }
    } catch (error) {
      message.error('Failed to schedule meeting. Please try again.');
      console.error('Scheduling error:', error);
    } finally {
      setSchedulingMeeting(false);
    }
  };

  const resetAndClose = () => {
    setCurrentStep(0);
    setAnalysis(null);
    setMeetingResponse(null);
    form.resetFields();
    onClose();
  };

  const getUrgencyColor = (urgency) => {
    const colors = { High: 'red', Medium: 'orange', Low: 'green' };
    return colors[urgency] || 'blue';
  };

  const getUrgencyIcon = (urgency) => {
    return urgency === 'High' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />;
  };

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          Smart Meeting Scheduler
        </Space>
      }
      open={visible}
      onCancel={resetAndClose}
      footer={null}
      width={850}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="AI Analysis" icon={<BulbOutlined />} />
        <Step title="Schedule Meeting" icon={<CalendarOutlined />} />
        <Step title="Confirmation" icon={<TeamOutlined />} />
      </Steps>

      {/* Step 0: Task Analysis */}
      {currentStep === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Title level={4}>Analyze Task with AI</Title>
          
          {task && (
            <Card style={{ marginBottom: 20, textAlign: 'left' }}>
              <Title level={5} style={{ marginBottom: 12 }}>{task.title}</Title>
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                {task.description || 'No description provided'}
              </Paragraph>
              <Space wrap>
                <Tag color={getUrgencyColor(task.status)}>{task.status}</Tag>
                <Tag icon={<TeamOutlined />}>
                  {task.members?.length || 0} assignees
                </Tag>
                {task.dueDate !== 'No date' && (
                  <Tag icon={<ClockCircleOutlined />}>
                    Due: {task.dueDate}
                  </Tag>
                )}
              </Space>
            </Card>
          )}
          
          <Button 
            type="primary" 
            size="large"
            icon={<BulbOutlined />}
            onClick={analyzeTask}
            loading={loading}
            style={{ 
              background: 'linear-gradient(90deg, #8F1383 0%, #432E54 100%)',
              border: 'none',
              height: 48,
              minWidth: 200
            }}
          >
            {loading ? 'Analyzing with AI...' : 'Generate Smart Recommendations'}
          </Button>
        </div>
      )}

      {/* Step 1: AI Analysis Results & Meeting Details Form */}
      {currentStep === 1 && analysis && (
        <div>
          {/* AI Analysis Results Card */}
          <Card 
            style={{ 
              marginBottom: 24, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none'
            }}
          >
            <Title level={4} style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BulbOutlined /> 
              🤖 AI Smart Recommendations
            </Title>
            
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, display: 'block', marginTop: 4 }}>
              Powered by OpenAI • {analysis.tokens_used || 0} tokens used
            </Text>
            
            {/* Key Metrics Grid */}
            <div style={{ 
              marginTop: 16, 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 16 
            }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 8 }}>
                <Text strong style={{ color: 'white', display: 'block' }}>Urgency Level</Text>
                <Tag 
                  color={getUrgencyColor(analysis.urgency || 'Medium')} 
                  icon={getUrgencyIcon(analysis.urgency)}
                  style={{ marginTop: 4 }}
                >
                  {analysis.urgency || 'Medium'}
                </Tag>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 8 }}>
                <Text strong style={{ color: 'white', display: 'block' }}>Duration</Text>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 500 }}>
                  {analysis.suggested_duration || 30} minutes
                </Text>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 8 }}>
                <Text strong style={{ color: 'white', display: 'block' }}>Best Time</Text>
                <Text style={{ color: 'white', fontSize: 14 }}>
                  {analysis.best_time_of_day || '10:00 AM - 11:00 AM'}
                </Text>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 8 }}>
                <Text strong style={{ color: 'white', display: 'block' }}>Best Day</Text>
                <Text style={{ color: 'white', fontSize: 14 }}>
                  {analysis.best_day_suggestion || 'Tuesday or Wednesday'}
                </Text>
              </div>
            </div>
            
            {/* Meeting Purpose */}
            {analysis.meeting_purpose && (
              <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                <Text strong style={{ color: 'white', display: 'block', marginBottom: 8 }}>
                  🎯 Meeting Purpose
                </Text>
                <Text style={{ color: 'white', lineHeight: 1.5 }}>{analysis.meeting_purpose}</Text>
              </div>
            )}
          </Card>

          {/* AI Agenda & Discussion Points */}
          {(analysis.agenda || analysis.recommended_discussion_points) && (
            <Card style={{ marginBottom: 20 }}>
              <Title level={5} style={{ color: '#8F1383', marginBottom: 16 }}>
                📋 AI Generated Agenda & Discussion Points
              </Title>
              
              {analysis.agenda && (
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Suggested Agenda:</Text>
                  <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 6, borderLeft: '4px solid #8F1383' }}>
                    {Array.isArray(analysis.agenda) ? (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {analysis.agenda.map((item, index) => (
                          <li key={index} style={{ marginBottom: 4, color: '#2c3e50' }}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <Text style={{ color: '#2c3e50' }}>{analysis.agenda}</Text>
                    )}
                  </div>
                </div>
              )}
              
              {analysis.recommended_discussion_points && (
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Key Discussion Points:</Text>
                  <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 6, border: '1px solid #91d5ff' }}>
                    {Array.isArray(analysis.recommended_discussion_points) ? (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {analysis.recommended_discussion_points.map((point, index) => (
                          <li key={index} style={{ marginBottom: 4, color: '#0050b3' }}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <Text style={{ color: '#0050b3' }}>{analysis.recommended_discussion_points}</Text>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Meeting Details Form */}
          <Card title="Meeting Details" style={{ marginBottom: 20 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={scheduleMeeting}
            >
              <Form.Item
                name="meetingTitle"
                label="Meeting Title"
                rules={[{ required: true, message: 'Please enter meeting title' }]}
              >
                <Input placeholder="Enter meeting title" size="large" />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Form.Item
                  name="meetingDate"
                  label="Date"
                  rules={[{ required: true, message: 'Please select date' }]}
                >
                  <DatePicker style={{ width: '100%' }} size="large" />
                </Form.Item>

                <Form.Item
                  name="meetingTime"
                  label="Time"
                  rules={[{ required: true, message: 'Please select time' }]}
                >
                  <TimePicker format="HH:mm" style={{ width: '100%' }} size="large" />
                </Form.Item>

                <Form.Item
                  name="duration"
                  label="Duration (minutes)"
                  rules={[{ required: true, message: 'Please select duration' }]}
                >
                  <Select size="large">
                    <Option value={15}>15 minutes</Option>
                    <Option value={30}>30 minutes</Option>
                    <Option value={45}>45 minutes</Option>
                    <Option value={60}>1 hour</Option>
                    <Option value={90}>1.5 hours</Option>
                    <Option value={120}>2 hours</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                name="meetingType"
                label="Meeting Type"
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Option value="google-meet">
                    <Space><GoogleOutlined style={{ color: '#4285f4' }} />Google Meet (Recommended)</Space>
                  </Option>
                  <Option value="internal">
                    <Space><VideoCameraOutlined />Internal Meeting (MindVerse)</Space>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="agenda"
                label="Meeting Agenda"
                extra="You can edit the AI-generated agenda above"
              >
                <TextArea 
                  rows={8}
                  placeholder="Meeting agenda (AI suggestion loaded)"
                />
              </Form.Item>

              {/* Preparation Notes */}
              {analysis.preparation_notes && (
                <Alert
                  message="Preparation Notes"
                  description={analysis.preparation_notes}
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

              {/* Success Metrics */}
              {analysis.success_metrics && (
                <Alert
                  message="Success Metrics"
                  description={analysis.success_metrics}
                  type="success"
                  showIcon
                  style={{ marginBottom: 20 }}
                />
              )}

              <div style={{ textAlign: 'right', marginTop: 20 }}>
                <Space>
                  <Button onClick={() => setCurrentStep(0)} size="large">
                    Back to Analysis
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={schedulingMeeting}
                    size="large"
                    style={{ 
                      background: 'linear-gradient(90deg, #8F1383 0%, #432E54 100%)',
                      border: 'none',
                      minWidth: 180
                    }}
                  >
                    {schedulingMeeting ? 'Scheduling...' : 'Schedule Meeting & Send Invites'}
                  </Button>
                </Space>
              </div>
            </Form>
          </Card>
        </div>
      )}

      {/* Step 2: Success Confirmation with Meeting Link */}
      {currentStep === 2 && meetingResponse && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 64, color: '#52c41a', marginBottom: 20 }}>
            ✅
          </div>
          <Title level={2} style={{ color: '#52c41a', marginBottom: 8 }}>
            Meeting Scheduled Successfully!
          </Title>
          <Text type="secondary" style={{ fontSize: 16, marginBottom: 24, display: 'block' }}>
            Your AI-optimized meeting has been created and invitations sent
          </Text>

          {/* Meeting Link Card */}
          <Card 
            style={{ 
              marginBottom: 24, 
              textAlign: 'left',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            <Title level={4} style={{ color: 'white', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              🔗 Your Meeting Link
            </Title>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.15)', 
              padding: 16, 
              borderRadius: 8,
              marginBottom: 16
            }}>
              <div style={{ marginBottom: 12 }}>
                <Text strong style={{ color: 'white', display: 'block', marginBottom: 8 }}>
                  Meeting: {meetingResponse.meeting?.title}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                  📅 {new Date(meetingResponse.meeting?.date).toDateString()} at {meetingResponse.meeting?.time}
                </Text>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.9)', 
                padding: 12, 
                borderRadius: 6,
                marginBottom: 12
              }}>
                <Text strong style={{ color: '#2c3e50', display: 'block', marginBottom: 4 }}>
                  Meeting Link:
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Input 
                    value={meetingResponse.meeting?.link} 
                    readOnly 
                    style={{ 
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      color: '#2c3e50',
                      fontFamily: 'monospace',
                      fontSize: 12
                    }}
                  />
                  <Button 
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(meetingResponse.meeting?.link);
                      message.success('Link copied to clipboard!');
                    }}
                    style={{ border: 'none', background: '#8F1383', color: 'white' }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <Button 
                  type="primary"
                  icon={<GoogleOutlined />}
                  onClick={() => window.open(meetingResponse.meeting?.link, '_blank')}
                  style={{ 
                    background: '#4285f4',
                    border: 'none',
                    flex: 1
                  }}
                >
                  Join Meeting Now
                </Button>
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(meetingResponse.meeting?.link);
                    message.success('Link copied to clipboard!');
                  }}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </div>
            
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
              💡 Save this link - it has been sent to all participants via email
            </Text>
          </Card>
          
          {/* Status Information */}
          <Card style={{ marginBottom: 24, textAlign: 'left' }}>
            <Title level={5} style={{ marginBottom: 16 }}>📧 Invitation Status</Title>
            <List
              size="small"
              dataSource={[
                `✅ Emails sent to ${meetingResponse.assignees?.length || 0} team members`,
                '📅 Calendar reminders automatically added for all participants',
                '📋 Agenda and preparation notes included in invitation',
                '⚡ AI recommendations applied to optimize meeting effectiveness',
                meetingResponse.emailStatus || 'Email delivery completed'
              ]}
              renderItem={item => (
                <List.Item style={{ padding: '8px 0', borderBottom: 'none' }}>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Card>

          <div style={{ marginTop: 32 }}>
            <Space>
              <Button 
                type="primary" 
                size="large"
                onClick={resetAndClose}
                style={{ 
                  background: 'linear-gradient(90deg, #8F1383 0%, #432E54 100%)',
                  border: 'none',
                  minWidth: 160,
                  height: 48
                }}
              >
                Done
              </Button>
              <Button 
                size="large"
                onClick={() => window.open(meetingResponse.meeting?.link, '_blank')}
                style={{ height: 48 }}
              >
                Open Meeting Link
              </Button>
            </Space>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SmartMeetingScheduler;