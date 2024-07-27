import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { RadioLabel } from '.';

describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<RadioLabel name={'test'} label='Label' component_size={'M'} is_selected={false} />);
        expect(screen.getByText('Label')).toBeVisible();
    });
});
