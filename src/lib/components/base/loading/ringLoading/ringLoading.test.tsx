import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import RingLoading from '.';

describe('RingLoading component', () => {

    it('renders the component RingLoading', () => {
        render(<RingLoading data-testid='test' component_size={'S'} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });

    /* size tests */
    it('applies Mid Style correctly', () => {
        render(<RingLoading
            data-testid='test'
            component_size={'M'} />
        )
        expect(screen.getByTestId('test')).toHaveClass("loading-frame-size-M");
    });

});
