import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { StepperDivider } from '.';

describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<StepperDivider data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
