import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { ContentColumn } from '.';

describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<ContentColumn data-testid='test' component_label={''} name={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
