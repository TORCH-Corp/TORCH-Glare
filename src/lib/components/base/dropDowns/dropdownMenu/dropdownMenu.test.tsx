import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import DropdownMenu from '.';

describe('Alert component', () => {

    it('renders the component label', () => {
        render(<DropdownMenu data-testid='dropdown' />);
        expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    });

    it('applies Info Style correctly', () => {
        render(<DropdownMenu data-testid='dropdown' component_style='Presentation-Style' />);
        expect(screen.getByTestId('dropdown')).toHaveClass('drop-down-menu-Presentation-Style');
        expect(screen.getByTestId('dropdown')).toBeVisible();
    });
});
