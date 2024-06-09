import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { ActionBarInputField } from '.';
import { DropDownMenu } from '../../main';

describe('ActionBarInputField component', () => {

    it('render the component', () => {
        render(<ActionBarInputField drop_down_list_child={<DropDownMenu></DropDownMenu>} name={'test'} data-testid='test' />);
        expect(screen.getByTestId('test')).toBeVisible();
    });

});

