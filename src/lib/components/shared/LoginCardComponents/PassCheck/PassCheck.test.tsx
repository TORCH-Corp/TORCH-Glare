import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import PasswordLevel from '.';

describe('PasswordLevel component', () => {

    it('renders the component', () => {
        render(<PasswordLevel data-testid='test' value={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
        expect(screen.getByTestId('test')).toHaveClass('password-level');
    });

    it('negative style', () => {
        render(<PasswordLevel data-testid='test' value={'123456'} />);
        expect(screen.getByTestId('test')).toBeVisible();
        expect(screen.getByTestId('test')).toHaveClass('weak');
    });

    it('warning style', () => {
        render(<PasswordLevel data-testid='test' value={'123456Q'} />);
        expect(screen.getByTestId('test')).toBeVisible();
        expect(screen.getByTestId('test')).toHaveClass('good');
    });

    it('success style', () => {
        render(<PasswordLevel data-testid='test' value={'123456Q@'} />);
        expect(screen.getByTestId('test')).toBeVisible();
        expect(screen.getByTestId('test')).toHaveClass('great');
    });
});
