import React, { useState } from 'react';
import { Input, Button, Space } from 'antd'; // import Space

interface UserRegistrationProps {
    onRegister: (username: string, password: string) => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isRegisterButtonDisabled = !username || !password;

    return (
        <div>
            <h2>Register New User</h2>
            <Space direction="vertical">
                <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <Input.Password placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <Button type="primary" onClick={() => onRegister(username, password)} disabled={isRegisterButtonDisabled}>Register</Button>
            </Space>
        </div>
    );
};

export default UserRegistration;