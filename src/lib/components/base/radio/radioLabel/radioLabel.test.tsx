import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { RadioLabel } from '.';

describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<RadioLabel check_box_name={'test'} label='Label' component_size={'M'} />);
        expect(screen.getByText('Label')).toBeVisible();
    });
});
