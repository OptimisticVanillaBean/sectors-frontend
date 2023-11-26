import React, { useState } from 'react';
import { Select, Button, Space } from 'antd';
import { notification } from 'antd';
import { Sector } from "./Sector.ts";

interface RequestFormProps {
    users: string[];
    selectedSectors: Sector[];
    termsAgreed: boolean;
    setTermsAgreed: (agreed: boolean) => void;
    refreshUserSectors: (username: string) => Promise<void>;
}

const RequestForm: React.FC<RequestFormProps> = ({ users, selectedSectors, termsAgreed, refreshUserSectors }) => {
    const [selectedUser, setSelectedUser] = useState<string>('');

    const handleUserChange = (value: string) => {
        setSelectedUser(value);
    };

    const handleFormSubmit = async () => {
        if (!termsAgreed) {
            notification.warning({
                message: 'Terms Not Accepted',
                description: 'The user must accept the terms',
            });
            return;
        }
        const requestFormDTO = {
            user: selectedUser,
            sectors: selectedSectors,
            termsAgreed: termsAgreed,
        };

        try {
            const response = await fetch('http://localhost:8080/requestForms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestFormDTO),
            });

            if (response.ok) {
                await refreshUserSectors(selectedUser);
            }

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error(errorMessage);
                return;
            }

            const createdRequestForm = await response.json();
            console.log(createdRequestForm);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div className="request_form_container">
            <Space direction="vertical">
                <Space direction="horizontal">
                    <h3>User</h3>
                    <Select
                        style={{ width: '100%', whiteSpace: 'normal', minWidth: '200px' }}
                        value={selectedUser}
                        onChange={handleUserChange}
                    >
                        {users.map(user => (
                            <Select.Option value={user} key={user}>
                                {user}
                            </Select.Option>
                        ))}
                    </Select>
                </Space>
                <Button onClick={handleFormSubmit} disabled={!selectedUser || selectedSectors.length === 0}> Submit </Button>
            </Space>
        </div>
    );
};

export default RequestForm;