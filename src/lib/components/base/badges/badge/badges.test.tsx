import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Badge from '.';

describe('Badge component', () => {

    it('renders the component label', () => {
        render(<Badge label="Label" />);
        expect(screen.getByText('Label')).toBeInTheDocument();
    });



    /* styles test */

    it('applies green Style correctly', () => {
        render(<Badge label='Label' badge_style='badge-green' data-testid='badge-green-style' />);
        expect(screen.getByTestId('badge-green-style')).toHaveClass("badge-green");
    });

    it('applies badge-green-light Style correctly', () => {
        render(<Badge label='Label' badge_style='badge-green-light' data-testid='badge-green-light' />);
        expect(screen.getByTestId('badge-green-light')).toHaveClass("badge-green-light");
    });

    it('applies badge-cocktail-green Style correctly', () => {
        render(<Badge label='Label' badge_style='badge-cocktail-green' data-testid='badge-cocktail-green' />);
        expect(screen.getByTestId('badge-cocktail-green')).toHaveClass("badge-cocktail-green");
    });

    it('applies badge-cocktail-green Style correctly', () => {
        render(<Badge label='Label' badge_style='badge-cocktail-green' data-testid='badge-cocktail-green' />);
        expect(screen.getByTestId('badge-cocktail-green')).toHaveClass("badge-cocktail-green");
    });



    /* size test */

    it('applies Small Style correctly', () => {
        render(<Badge label='Label' badge_size='S' data-testid='badge-size-s' />);
        expect(screen.getByTestId('badge-size-s')).toHaveClass("glare-badge-size-S");
    });

    it('applies Mid Style correctly', () => {
        render(<Badge label='Label' badge_size='M' data-testid='badge-size-m' />);
        expect(screen.getByTestId('badge-size-m')).toHaveClass("glare-badge-size-M");
    });


    /* selected case */

    it('applies Show close Button correctly', () => {
        render(<Badge label='Label' selected={true} />);
        expect(screen.getByRole('button')).toHaveClass("glare-badge-close-icon");
    });
});
