import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { CheckboxLabel } from '.';

describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<CheckboxLabel check_box_name={'test'} label='Label' />);
        expect(screen.getByText('Label')).toBeInTheDocument();
    });

    /* size tests */
    it('applies Mid Style correctly', () => {
        render(<CheckboxLabel
            component_size='M'
            data-testid='mid-size'
            check_box_name={'test1'} />
        );
        expect(screen.getByTestId('mid-size')).toHaveClass("glare-CheckboxLabel-input-M");
    });
});
