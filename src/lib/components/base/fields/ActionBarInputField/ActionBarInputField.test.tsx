import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { ActionBarInputField } from '.';
import { DropDownMenu } from '../../main';

describe('ActionBarInputField component', () => {

    it('render the component', () => {
        render(<ActionBarInputField drop_down_list_child={<DropDownMenu></DropDownMenu>} name={'test'} data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });

    it('displays dropdown list on click', () => {
        render(<ActionBarInputField
            data-testid='test'
            drop_down_list_child={<DropDownMenu data-testid="dropdown">
                dropdown item
            </DropDownMenu>} name={''} />
        );

        const button = screen.getByTestId('test');
        expect(screen.getByTestId('dropdown')).not.toBeVisible()

        fireEvent.click(button);
        expect(screen.getByTestId('dropdown')).toBeVisible()
    });

});

