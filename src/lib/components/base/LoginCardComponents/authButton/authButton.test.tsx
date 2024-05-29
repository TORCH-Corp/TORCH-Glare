import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import AuthButton from '.';

describe('AuthButton component', () => {

    it('renders the component', () => {
        render(<AuthButton data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
        expect(screen.getByTestId('test')).toHaveClass('sign-in-button');
    });
});
