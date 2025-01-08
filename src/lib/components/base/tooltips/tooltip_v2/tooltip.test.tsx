import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Tooltip from '.';

describe('TopFormBarItem component', () => {

    it('renders the component label', () => {
        render(<Tooltip message={'Label'} />);
        expect(screen.getByText('Label')).toBeVisible();
    });
});
