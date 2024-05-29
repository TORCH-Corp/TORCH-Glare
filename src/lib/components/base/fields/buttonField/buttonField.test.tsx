import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import ButtonField from '.';

describe('ButtonField component', () => {

    it('render the component', () => {
        render(<ButtonField data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });

    it('renders the component divider', () => {
        render(<ButtonField with_divider data-testid='test' />);
        expect(screen.getByTestId('test')).toHaveClass("with-divider");
    });

});

