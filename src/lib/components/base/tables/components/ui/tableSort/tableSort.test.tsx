import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { TableSort } from '.';

describe('TableSort component', () => {
    it('renders the component', () => {
        render(<TableSort data-testid='test' component_size={'S'} sort_direction={'UP'} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
