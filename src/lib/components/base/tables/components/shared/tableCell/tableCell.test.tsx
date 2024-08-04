import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { TableCell } from '.';

describe('TableCell component', () => {
    it('renders the component', () => {
        render(<TableCell
            data-testid='test'
            component_size={'S'}
            name={''}
            cellLabel={''}
        />);
        expect(screen.getByTestId('test')).toBeVisible();
    });


});
