import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { LinkButton } from '.';

describe('LinkButton component', () => {

    it('renders the component label', () => {
        render(<LinkButton >Label</LinkButton>);
        expect(screen.getByText('Label')).toBeInTheDocument();
    });

    /* size tests */
    it('applies Mid Style correctly', () => {
        render(<LinkButton
            component_size='M'
            data-testid='small-size'
        >Label</LinkButton>);
        expect(screen.getByTestId('small-size')).toHaveClass("glare-link-button-size-M");
    });

    it('applies arabic layout Style correctly', () => {
        render(<LinkButton
            dir='rtl'
            data-testid='rtl-dir'
        >Label</LinkButton>);
        expect(screen.getByTestId('rtl-dir')).toHaveClass("link-button-reverse");
    });

});
