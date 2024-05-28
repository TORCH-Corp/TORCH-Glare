import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { DropDownButton } from '.';
import DropDownMenu from '../dropdownMenu';

describe('DropDownButton component', () => {

    it('renders the component label', () => {
        render(<DropDownButton component_label={'Label'} drop_down_list_child={<DropDownMenu></DropDownMenu>} />);
        expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('displays dropdown list on click', () => {
        render(<DropDownButton component_label={'Label'}
            drop_down_list_child={
                <DropDownMenu data-testid="dropdown">
                    dropdown item
                </DropDownMenu>} />
        );

        // 
        const button = screen.getByText('Label');
        expect(screen.getByTestId('dropdown')).not.toBeVisible()

        fireEvent.click(button);
        expect(screen.getByTestId('dropdown')).toBeVisible()
    });
});

