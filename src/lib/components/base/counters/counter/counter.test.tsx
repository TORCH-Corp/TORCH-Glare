import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Counter from '.';

describe('Counter component', () => {

    it('renders the component label', () => {
        render(<Counter label={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

});
