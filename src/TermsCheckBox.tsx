import React from 'react';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

interface TermsCheckboxProps {
    onChange: (e: CheckboxChangeEvent) => void;
    checked: boolean;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ onChange, checked }) => {
    return (
        <Checkbox onChange={onChange} checked={checked}>
            I agree to the terms and conditions
        </Checkbox>
    );
};

export default TermsCheckbox;