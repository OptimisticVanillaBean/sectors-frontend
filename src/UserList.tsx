import React from 'react';
import {Space, Table, Tag} from 'antd';
import { UserOutlined, BranchesOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface UserListProps {
    users: string[];
    userRequestForms: { [key: string]: { user: string, sectors: { name: string, id: number }[], termsAgreed: boolean } };
}

const UserList: React.FC<UserListProps> = ({ users, userRequestForms }) => {
    const columns: ColumnsType<{ user: string, sectors: string[] }> = [
        {
            title: (
                <>
                    <Space align="end">
                        <UserOutlined /> User
                    </Space>
                </>
            ),
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: (
                <>
                    <Space align="end">
                        <BranchesOutlined /> Sectors
                    </Space>
                </>
            ),
            dataIndex: 'sectors',
            key: 'sectors',
            render: sectors => (
                <>
                    {sectors.map(sector => (
                        <Tag color="blue" key={sector}>
                            {sector}
                        </Tag>
                    ))}
                </>
            ),
        },
    ];

    const data = users.map(user => ({
        user,
        sectors: userRequestForms[user]?.sectors.map(sector => sector.name) || [],
    }));

    return (
        <div className="user_list_container">
            <Table className="user-table" columns={columns} dataSource={data} rowKey="user" />
        </div>
    );
};

export default UserList;