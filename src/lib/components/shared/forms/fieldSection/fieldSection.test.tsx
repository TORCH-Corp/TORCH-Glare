import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { FieldSection } from '.';

describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<FieldSection data-testid='test' name={''} label={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
