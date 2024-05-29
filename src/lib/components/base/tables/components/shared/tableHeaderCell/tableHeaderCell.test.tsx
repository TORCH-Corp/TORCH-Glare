import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { TableHeaderCell } from '.';

describe('TableHeaderCell component', () => {
    it('renders the component', () => {
        render(<TableHeaderCell
            data-testid='test'
            component_size={'S'} label={''} id={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });


});
