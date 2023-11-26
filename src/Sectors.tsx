import React, {useState} from 'react';
import {Space, TreeSelect} from 'antd';

interface Sector {
    id: number;
    name: string;
    children?: Sector[];
}

interface SectorsProps {
    sectors: Sector[];
    setSelectedSectors: (sectors: Sector[]) => void;
}

const Sectors: React.FC<SectorsProps> = ({ sectors, setSelectedSectors }) => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const renderTreeNodes = (data: Sector[], parentId = '', includedSectorIds = new Set<number>()) =>
        data.reduce((acc, item) => {
            const uniqueKey = `${parentId}-${item.id}`;
            if (includedSectorIds.has(item.id)) {
                return acc;
            }
            includedSectorIds.add(item.id);
            const treeNode = item.children ? (
                <TreeSelect.TreeNode value={uniqueKey} title={item.name} key={uniqueKey}>
                    {renderTreeNodes(item.children, uniqueKey, includedSectorIds)}
                </TreeSelect.TreeNode>
            ) : (
                <TreeSelect.TreeNode value={uniqueKey} title={item.name} key={uniqueKey} />
            );
            return [...acc, treeNode];
        }, [] as React.ReactNode[]);

    const handleSelectChange = (selectedUniqueKeys: string[]) => {
        setSelectedKeys(selectedUniqueKeys);
        const selectedSectorObjects = selectedUniqueKeys.map(uniqueKey => {
            const id = uniqueKey.split('-').pop() as string;
            const sector = sectors.find(sector => sector.id.toString() === id);
            return sector ? { id: sector.id, name: sector.name } : undefined;
        }).filter(Boolean) as { id: number; name: string }[];
        setSelectedSectors(selectedSectorObjects);
    };

    return (
        <div className="sectors_container">
            <Space direction="horizontal">
                <h3>Sectors</h3>
                <TreeSelect
                    style={{ width: 300 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeDefaultExpandAll
                    multiple
                    value={selectedKeys}
                    onChange={handleSelectChange}
                >
                    {renderTreeNodes(sectors)}
                </TreeSelect>
            </Space>
        </div>
    );
};

export default Sectors;