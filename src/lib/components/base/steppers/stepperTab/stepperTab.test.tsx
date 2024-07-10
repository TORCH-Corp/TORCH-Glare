import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { StepperTab } from '.';

describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<StepperTab data-testid='test' stepper_counter={0} stepper_label={'test'} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
