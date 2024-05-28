import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Button from '.';

describe('Button component', () => {

    it('renders the component label', () => {
        render(<Button>Test Label</Button>);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    /* styles test */

    it('applies BlueContStyle Style correctly', () => {
        render(<Button
            component_style="BlueContStyle"
            data-testid='BlueContStyle'
        >Test Label
        </Button>);
        expect(screen.getByTestId('BlueContStyle')).toHaveClass("BlueContStyle");
    });

    /* size test */

    it('applies Mid size correctly', () => {
        render(<Button
            component_size='M'
            data-testid='mid-size'
        >Test Label
        </Button>);
        expect(screen.getByTestId('mid-size')).toHaveClass("glare-button-M");
    });



    /* loading style test */

    it('applies loading Style correctly', () => {
        render(<Button
            is_loading
            data-testid='loading-style'
        >Test Label
        </Button>);
        expect(screen.getByTestId('loading-style')).toHaveClass("glare-button-loading");
    });

    it('to show loading img correctly', () => {
        render(<Button
            is_loading
            data-testid='loading'
        >Test Label
        </Button>);
        expect(screen.getByRole('img')).toHaveClass("glare-button-loading-img");
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

});
