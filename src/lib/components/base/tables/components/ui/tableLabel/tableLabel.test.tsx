import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { TableLabel } from '.';

describe('TableLabel component', () => {
    it('renders the component', () => {
        render(<TableLabel data-testid='test' component_size={'S'} typo_size={'SemiBold'} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
