import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Label } from '.';

describe('Label component', () => {

    it('renders the component label', () => {
        render(<Label label='Label' name={''} ></Label>);
        expect(screen.getByText('Label')).toBeInTheDocument();
    });

    /* size tests */
    it('applies Mid Style correctly', () => {
        render(<Label
            component_size='M'
            data-testid='small-size'
            name={''} />
        )
        expect(screen.getByTestId('small-size')).toHaveClass("M");
    });

});
