import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { LabelLessInput } from '.';
import { DropDownMenu } from '../../main';

describe('LabelLessInput component', () => {

    it('render the component', () => {
        render(<LabelLessInput data-testid='test' name={''} label={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });


    it('displays dropdown list on click', () => {
        render(<LabelLessInput
            data-testid='test'
            drop_down_list_child={<DropDownMenu data-testid="dropdown">
                dropdown item
            </DropDownMenu>} name={''} label={''} />
        );

        const button = screen.getByTestId('test');
        expect(screen.getByTestId('dropdown')).not.toBeVisible()

        fireEvent.click(button);
        expect(screen.getByTestId('dropdown')).toBeVisible()
    });

});

