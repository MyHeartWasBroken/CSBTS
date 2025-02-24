import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from './assets/logo.jpg'; // Import the image
import axios from "axios";

function Login({ onLogin }) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        axios.post('http://localhost:5000/api/login', {
            userName: userName,
            password: password
    }).then(response => {
        onLogin(response.data);
    }).catch(error => {
        console.error('登录错误', error);
    });
};

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f2f5',
                width: '100vw',
            }}>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                style={{
                    width: 300,
                    padding: 20,
                    border: '1px solid #ccc',
                    borderRadius: 10,
                    boxShadow: '0 0 10px #ccc',
                    backgroundColor: '#fff',
                    textAlign: 'center',
                    fontSize: 20,
                }}
            >
                <div
                    style={{
                        textAlign: 'center',
                        marginBottom: 20,
                    }}
                >
                    <img src={logo} alt="logo"
                        style={{
                            width: 100,
                            height: 100,
                        }} />
                </div>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" value={userName} onChange={e => setUserName(e.target.value)} />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="密码"
                        value={password} onChange={e => setPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;