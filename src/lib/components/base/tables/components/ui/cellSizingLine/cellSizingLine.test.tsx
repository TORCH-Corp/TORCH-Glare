import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { CellSizingLine } from '.';

describe('CellSizingLine component', () => {
    it('renders the component', () => {
        render(<CellSizingLine data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
