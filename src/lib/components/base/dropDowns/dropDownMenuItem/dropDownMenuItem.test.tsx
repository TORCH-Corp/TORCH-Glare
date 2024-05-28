import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import DropDownMenuItem from '.';

describe('DropDownMenuItem component', () => {

    it('renders the component label', () => {
        render(<DropDownMenuItem data-testid='dropdown-item' component_label={'Label'} element_name={'test'} />);
        expect(screen.getByTestId('dropdown-item')).toBeVisible();
    });

    it('applies Mid size correctly', () => {
        render(<DropDownMenuItem data-testid='dropdown-item' component_label={'Label'} element_name={'test'} component_size='M' />);
        expect(screen.getByTestId('dropdown-item')).toBeVisible();
        expect(screen.getByTestId('dropdown-item')).toHaveClass("dropDownMenuItem-size-M");
    });

    it('applies Presentation-Warning Style correctly', () => {
        render(<DropDownMenuItem data-testid='dropdown-item' component_label={'Label'} element_name={'test'} component_size='M' component_style='Presentation-Warning-Style' />)
        expect(screen.getByTestId('dropdown-item')).toBeVisible();
        expect(screen.getByTestId('dropdown-item')).toHaveClass("menuItem-Presentation-Warning-Style");
    });

    it('applies have input checkbox correctly', () => {
        render(<DropDownMenuItem data-testid='dropdown-item' component_label={'Label'} element_name={'test'} component_size='M' component_style='Presentation-Warning-Style' component_type='checkbox' />)
        // Check if there is an input element of type checkbox within the dropdown item
        const checkbox = screen.getByRole('checkbox', { name: /Label/i });
        expect(checkbox).toBeVisible();
    });
});
