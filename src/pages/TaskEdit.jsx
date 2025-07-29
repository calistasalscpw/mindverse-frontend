import React from 'react';
import { Form, Input, DatePicker, Select, Button, Typography, Row, Col } from 'antd'; 
import stickman2Image from "../assets/stickman2.png";


const { Option } = Select;
const { Title } = Typography;

function TaskCreate() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    //(API)
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center', // Pusatkan horizontal
      alignItems: 'center',     // Pusatkan vertikal
      minHeight: '100vh',       // Tinggi minimal 100% viewport
      backgroundColor: '#f0f2f5', // Background warna abu-abu muda seperti di gambar
    }}>
      {/* HAPUS BAGIAN HEADER/NAVBAR SEBELUMNYA */}
      {/* HAPUS BAGIAN SIDEBAR SEBELUMNYA */}

      {/* Konten utama form Task Create (hanya card-nya saja) */}
      <div style={{ // Menggantikan .task-form-card
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        padding: '40px',
        width: '800px', // Lebar card (sesuaikan)
        display: 'grid', // Gunakan grid untuk layout form dan gambar
        gridTemplateColumns: '2fr 1fr', // Dua kolom: form (2 bagian) dan gambar (1 bagian)
        gap: '30px', // Jarak antar kolom
        alignItems: 'center', // Vertically align items in the grid
        position: 'relative', // Untuk posisi lingkaran abu-abu
      }}>
        {/* Lingkaran abu-abu di kiri atas kartu */}
        <div style={{
          position: 'absolute',
          top: '20px', // Sesuaikan posisi
          left: '20px', // Sesuaikan posisi
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: '#E0E0E0', // Warna abu-abu yang cocok
        }}></div>

        <Title level={2} style={{ gridColumn: '1 / 2', marginTop: 0, color: '#333', marginLeft: '50px' }}>Edit Task</Title> 
        <p style={{ gridColumn: '1 / 2', color: '#666', marginBottom: '25px', marginLeft: '50px' }}>Edit The Task!</p>

        <Form
          form={form}
          name="task_create_form"
          onFinish={onFinish}
          layout="vertical"
          style={{ // Menggantikan .task-form-card form
            gridColumn: '1 / 2', // Form di kolom pertama
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginLeft: '50px', // Geser form ke kanan untuk sejajar dengan teks
          }}
        >
          {/* Baris untuk Task Name dan Deadline (bersebelahan) */}
          <Row gutter={16}> {/* Gutter untuk jarak antar kolom */}
            <Col span={12}> {/* Mengambil 1/2 lebar */}
              <Form.Item
                label="Task Name*"
                name="taskName"
                rules={[{ required: true, message: 'Please input your Task Name!' }]}
              >
                <Input placeholder="Task Name" />
              </Form.Item>
            </Col>
            <Col span={12}> {/* Mengambil 1/2 lebar */}
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
            <Button type="primary" htmlType="submit" style={{ // Menggantikan .add-task-button
              background: 'linear-gradient(to right, #8a2be2, #ff69b4)', // Gradient ungu-pink
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
        <div style={{ // Menggantikan .image-placeholder
          gridColumn: '2 / 3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Pastikan path gambar ini benar di folder public/ atau assets Anda */}
          <img src={stickman2Image} alt="Todo List Illustration" style={{ // Menggantikan .image-placeholder img
            maxWidth: '100%',
            height: 'auto',
            display: 'block',
          }} />
        </div>
      </div>

      {/* Lingkaran robot di kanan bawah */}
      <div style={{
        position: 'fixed', // Agar tetap di posisi saat scroll
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#6a0dad', // Warna ungu
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '2rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        🤖
      </div>
    </div>
  );
}

export default TaskCreate;