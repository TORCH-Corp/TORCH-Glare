import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import SideBarItem from '.';
describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<SideBarItem data-testid='test' Label={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
