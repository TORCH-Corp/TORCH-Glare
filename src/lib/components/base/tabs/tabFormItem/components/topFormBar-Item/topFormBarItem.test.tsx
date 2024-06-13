import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import TopFormBarItem from '.';

describe('TopFormBarItem component', () => {

    it('renders the component label', () => {
        render(<TopFormBarItem label='Label' component_size={'M'} name={''} />);
        expect(screen.getByText('Label')).toBeVisible();
    });
});
