import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import ProfileItem from '.';
describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<ProfileItem data-testid='test' Label={''} user_avatar={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
