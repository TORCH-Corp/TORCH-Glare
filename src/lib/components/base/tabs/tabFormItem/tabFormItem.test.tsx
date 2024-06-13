import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import TabFormItem from '.';

describe('TabFormItem component', () => {

    it('renders the component label', () => {
        render(<TabFormItem componentType={'Top'} >Label</TabFormItem>);
        expect(screen.getByText('Label')).toBeVisible();
    });
});
