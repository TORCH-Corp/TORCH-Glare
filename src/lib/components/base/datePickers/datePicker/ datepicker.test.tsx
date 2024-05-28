import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Datepicker } from '.';

describe('DatePicker component', () => {

    it('renders the component label', () => {
        render(<Datepicker placeholder={'input'} name={''} />);
        expect(screen.getByPlaceholderText('input')).toBeInTheDocument();
    });
});
