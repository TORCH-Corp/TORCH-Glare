import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import TopFormBarItem from '.';

describe('TopFormBarItem component', () => {

    it('renders the component label', () => {
        render(<TopFormBarItem >Label</TopFormBarItem>);
        expect(screen.getByText('Label')).toBeVisible();
    });
});
