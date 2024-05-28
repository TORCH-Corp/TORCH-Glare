import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import DropDownMenu from '../dropdownMenu';
import { DropDownButtonResultShow } from '.';

describe('DropDownButtonResultShow component', () => {

    it('renders the component label', () => {
        render(<DropDownButtonResultShow selected_value={'Label'} drop_down_list_child={<DropDownMenu></DropDownMenu>} />);
        expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('displays dropdown list on click', () => {
        render(<DropDownButtonResultShow selected_value={'Label'}
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

