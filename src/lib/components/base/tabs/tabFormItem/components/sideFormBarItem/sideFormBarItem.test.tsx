import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import SideFormBarItem from '.';

describe('SideFormBarItem component', () => {

    it('renders the component label', () => {
        render(<SideFormBarItem >Label</SideFormBarItem>);
        expect(screen.getByText('Label')).toBeVisible();
    });
});
