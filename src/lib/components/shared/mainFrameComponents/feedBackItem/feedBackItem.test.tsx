import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { FeedBackItem } from '.';

describe('CheckboxLabel component', () => {

    it('renders the component label', () => {
        render(<FeedBackItem data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
