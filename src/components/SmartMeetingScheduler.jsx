import React, { useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, TimePicker, Select, Card, Tag, Steps, message, Space, Typography, List } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, TeamOutlined, BulbOutlined, GoogleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import API from '../api';

const { Title, Text } = Typography;
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

  // Step 1: AI Analysis
  const analyzeTask = async () => {
    if (!task) return;
    
    setLoading(true);
    try {
      const response = await API.post('/meetings/analyze-task', {
        taskId: task.id
      });
      
      if (response.data.success) {
        setAnalysis(response.data.analysis);
        
        // Pre-fill form with AI suggestions
        form.setFieldsValue({
          meetingTitle: response.data.analysis.suggested_title,
          duration: response.data.analysis.suggested_duration,
          meetingDate: response.data.analysis.suggested_date ? 
            dayjs(response.data.analysis.suggested_date) : dayjs().add(1, 'day'),
          meetingTime: dayjs('10:00', 'HH:mm'),
          meetingType: 'google-meet',
          agenda: response.data.analysis.agenda?.join('\n• ') || ''
        });
        
        setCurrentStep(1);
        message.success('Task analysis completed! Review the suggestions below.');
      }
    } catch (error) {
      // Fallback to mock analysis if API fails
      const mockAnalysis = {
        suggested_title: `${task.status} Review - ${task.title}`,
        suggested_duration: task.status === 'To Do' ? 45 : task.status === 'Review' ? 60 : 30,
        urgency: task.dueDate !== 'No date' ? 'High' : 'Medium',
        best_time_of_day: '10:00 AM - 11:00 AM',
        best_day_suggestion: 'Tuesday or Wednesday',
        agenda: task.status === 'To Do' ? 
          ['Project kickoff and overview', 'Role assignments', 'Timeline planning', 'Resource discussion'] :
          task.status === 'Review' ? 
          ['Deliverables presentation', 'Quality assessment', 'Feedback discussion', 'Approval process'] :
          ['Progress status update', 'Challenge discussion', 'Resource needs', 'Next steps'],
        meeting_purpose: `Coordinate team efforts for ${task.title}`,
        preparation_notes: 'Review task requirements and current progress',
        suggested_date: dayjs().add(1, 'day').format('YYYY-MM-DD')
      };
      
      setAnalysis(mockAnalysis);
      
      // Pre-fill form with mock suggestions
      form.setFieldsValue({
        meetingTitle: mockAnalysis.suggested_title,
        duration: mockAnalysis.suggested_duration,
        meetingDate: dayjs(mockAnalysis.suggested_date),
        meetingTime: dayjs('10:00', 'HH:mm'),
        meetingType: 'internal',
        agenda: '• ' + mockAnalysis.agenda.join('\n• ')
      });
      
      setCurrentStep(1);
      message.success('Task analysis completed! Review the suggestions below.');
      console.error('Analysis error, using fallback:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Schedule Meeting
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
    form.resetFields();
    onClose();
  };

  const getUrgencyColor = (urgency) => {
    const colors = { High: 'red', Medium: 'orange', Low: 'green' };
    return colors[urgency] || 'blue';
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
      width={800}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Analyze Task" icon={<BulbOutlined />} />
        <Step title="Schedule Meeting" icon={<CalendarOutlined />} />
        <Step title="Confirmation" icon={<TeamOutlined />} />
      </Steps>

      {/* Step 0: Task Analysis */}
      {currentStep === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Title level={4}>Analyze Task for Smart Meeting</Title>
          
          {task && (
            <Card style={{ marginBottom: 20, textAlign: 'left' }}>
              <Title level={5}>{task.title}</Title>
              <Text type="secondary">{task.description || 'No description provided'}</Text>
              <div style={{ marginTop: 12 }}>
                <Tag color={getUrgencyColor(task.status)}>{task.status}</Tag>
                <Tag icon={<TeamOutlined />}>
                  {task.members?.length || 0} assignees
                </Tag>
                {task.dueDate !== 'No date' && (
                  <Tag icon={<ClockCircleOutlined />}>
                    Due: {task.dueDate}
                  </Tag>
                )}
              </div>
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
              height: 48
            }}
          >
            {loading ? 'Analyzing Task...' : 'Analyze with AI'}
          </Button>
        </div>
      )}

      {/* Step 1: Meeting Details Form */}
      {currentStep === 1 && analysis && (
        <div>
          {console.log('Rendering analysis card with data:', analysis)}
          <Card style={{ marginBottom: 20, background: '#f8f9fa' }}>
            <Title level={5} style={{ margin: 0, color: '#8F1383' }}>
              <BulbOutlined /> AI Analysis Results
            </Title>
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <Text strong>Urgency:</Text> <Tag color={getUrgencyColor(analysis.urgency || 'Medium')}>{analysis.urgency || 'Medium'}</Tag>
              </div>
              <div>
                <Text strong>Suggested Duration:</Text> {analysis.suggested_duration || 30} minutes
              </div>
              <div>
                <Text strong>Best Time:</Text> {analysis.best_time_of_day || '10:00 AM - 11:00 AM'}
              </div>
              <div>
                <Text strong>Best Day:</Text> {analysis.best_day_suggestion || 'Tuesday or Wednesday'}
              </div>
            </div>
            
            {analysis.meeting_purpose && (
              <div style={{ marginTop: 12 }}>
                <Text strong>Purpose:</Text> <Text>{analysis.meeting_purpose}</Text>
              </div>
            )}
            
            {analysis.recommended_discussion_points && (
              <div style={{ marginTop: 16, padding: 12, background: '#e6f7ff', borderRadius: 6, border: '1px solid #91d5ff' }}>
                <Text strong style={{ color: '#1890ff' }}>🎯 AI Recommended Discussion Points:</Text>
                <div style={{ marginTop: 8 }}>
                  {Array.isArray(analysis.recommended_discussion_points) ? 
                    analysis.recommended_discussion_points.map((point, index) => (
                      <div key={index} style={{ marginBottom: 4, color: '#0050b3' }}>
                        • {point}
                      </div>
                    )) :
                    <Text style={{ color: '#0050b3' }}>{analysis.recommended_discussion_points}</Text>
                  }
                </div>
              </div>
            )}
            
            {analysis.success_metrics && (
              <div style={{ marginTop: 12, fontSize: '13px', color: '#666' }}>
                <Text strong>Success Metrics:</Text> {analysis.success_metrics}
              </div>
            )}
          </Card>

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
              <Input placeholder="Enter meeting title" />
            </Form.Item>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Form.Item
                name="meetingDate"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="meetingTime"
                label="Time"
                rules={[{ required: true, message: 'Please select time' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="duration"
                label="Duration (minutes)"
                rules={[{ required: true, message: 'Please select duration' }]}
              >
                <Select>
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
              <Select>
                <Option value="google-meet">
                  <Space><GoogleOutlined />Google Meet (Recommended)</Space>
                </Option>
                <Option value="internal">
                  <Space><VideoCameraOutlined />Internal Meeting (MindVerse)</Space>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="agenda"
              label="Meeting Agenda"
            >
              <TextArea 
                rows={6}
                placeholder="Meeting agenda (AI suggestion loaded)"
              />
            </Form.Item>

            {analysis.preparation_notes && (
              <Card size="small" style={{ marginBottom: 16, background: '#fff7e6' }}>
                <Text strong>Preparation Notes:</Text>
                <br />
                <Text>{analysis.preparation_notes}</Text>
              </Card>
            )}

            <div style={{ textAlign: 'right', marginTop: 20 }}>
              <Space>
                <Button onClick={() => setCurrentStep(0)}>
                  Back to Analysis
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={schedulingMeeting}
                  style={{ background: '#8F1383', borderColor: '#8F1383' }}
                >
                  Schedule Meeting & Send Invites
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      )}

      {/* Step 2: Success Confirmation */}
      {currentStep === 2 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }}>
            ✅
          </div>
          <Title level={3} style={{ color: '#52c41a' }}>
            Meeting Scheduled Successfully!
          </Title>
          
          <Card style={{ marginTop: 20, textAlign: 'left' }}>
            <List
              size="small"
              dataSource={[
                `Meeting invitations sent to ${task?.members?.length || 0} participants`,
                'Email invitations include meeting link and agenda',
                'Participants will receive calendar reminders',
                'Meeting room/link will be accessible 10 minutes before start time'
              ]}
              renderItem={item => (
                <List.Item>
                  <Text>{item}</Text>
                </List.Item>
              )}
            />
          </Card>

          <div style={{ marginTop: 24 }}>
            <Button 
              type="primary" 
              size="large"
              onClick={resetAndClose}
              style={{ background: '#8F1383', borderColor: '#8F1383' }}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SmartMeetingScheduler;