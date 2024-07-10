import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import IconButton from '.';
describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<IconButton data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
