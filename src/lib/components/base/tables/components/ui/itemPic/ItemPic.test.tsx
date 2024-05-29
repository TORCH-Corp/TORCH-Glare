import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { ItemPic } from '.';

describe('ItemPic component', () => {
    it('renders the component', () => {
        render(<ItemPic data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });
});
