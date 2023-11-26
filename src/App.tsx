import { useEffect, useState, useCallback } from 'react';
import { notification, Space } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import './App.css';
import TermsCheckbox from "./TermsCheckBox.tsx";
import Sectors from "./Sectors.tsx";
import UserRegistration from "./UserRegistration.tsx";
import UserList from "./UserList.tsx";
import { Row, Col } from 'antd';
import { Sector } from "./Sector.ts";
import {User} from "./User.ts";
import RequestForm from "./RequestForm.tsx";

interface RequestForm {
    user: string;
    sectors: Sector[];
    termsAgreed: boolean;
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [sectors, setSectors] = useState([]);
    const [selectedSectors, setSelectedSectors] = useState<Sector[]>([]);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [userRequestForms, setUserRequestForms] = useState<{ [key: string]: RequestForm }>({});
    const onChange = (e: CheckboxChangeEvent) => {
        setTermsAgreed(e.target.checked);
    };

    const openNotification = (type: NotificationType, message: string) => {
        notification[type]({
            message,
        });
    };

    const fetchRequestFormsForUser = useCallback(async (username: string) => {
        try {
            const response = await fetch(`http://localhost:8080/requestForms/${username}`);

            if (!response.ok) {
                if (response.status !== 404) {
                    const errorMessage = await response.text();
                    openNotification('error', errorMessage);
                }
                return;
            }

            const requestForms = await response.json();
            setUserRequestForms(prevState => ({ ...prevState, [username]: requestForms }));
        } catch (error) {
            openNotification('error', 'An error occurred');
        }
    }, []);

    useEffect(() => {
        users.forEach(user => fetchRequestFormsForUser(user.username));
    }, [users, fetchRequestFormsForUser]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/users');

                if (!response.ok) {
                    const errorMessage = await response.text();
                    openNotification('error', errorMessage);
                    return;
                }

                const usersFromServer = await response.json();
                setUsers(usersFromServer);
            } catch (error) {
                openNotification('error', 'An error occurred');
            }
        };
        getUsers().catch(() => {
            openNotification('error', 'An error occurred');
        });

        const getSectors = async () => {
            try {
                const response = await fetch('http://localhost:8080/sectors');

                if (!response.ok) {
                    const errorMessage = await response.text();
                    openNotification('error', errorMessage);
                    return;
                }

                const sectorsFromServer = await response.json();
                setSectors(sectorsFromServer);
            } catch (error) {
                openNotification('error', 'An error occurred');
            }
        };
        getSectors().catch(() => {
            openNotification('error', 'An error occurred');
        });
    }, []);

    const registerUser = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                openNotification('error', errorMessage);
                return;
            }

            const newUser = await response.json();
            setUsers([...users, newUser]);
        } catch (error) {
            openNotification('error', 'An error occurred');
        }
    };

    return (
        <div className="app_container">
            <Row>
                <Col span={12}>
                    <UserRegistration onRegister={registerUser} />
                </Col>
                <Col span={12}>
                    <UserList users={users.map(user => user.username)} userRequestForms={userRequestForms} />
                </Col>
            </Row>
            <h2>Please enter your name and pick the Sectors you are currently involved in.</h2>
            <Space direction="vertical">
                <Sectors sectors={sectors} setSelectedSectors={setSelectedSectors} />
                <RequestForm users={users.map(user => user.username)} selectedSectors={selectedSectors} termsAgreed={termsAgreed} setTermsAgreed={setTermsAgreed} refreshUserSectors={fetchRequestFormsForUser} />
                <TermsCheckbox onChange={onChange} checked={termsAgreed} />
            </Space>
        </div>
    );
}

export default App;
