import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { TableIconCell } from '.';

describe('TableIconCell component', () => {
    it('renders the component', () => {
        render(<TableIconCell data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
