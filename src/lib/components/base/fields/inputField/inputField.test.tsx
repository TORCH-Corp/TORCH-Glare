import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { InputField } from '.';

describe('InputField component', () => {

    it('render the component', () => {
        render(<InputField data-testid='test' name={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});

