import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { NoteInputField } from '.';

describe('NoteInputField component', () => {
    it('render the component', () => {
        render(<NoteInputField data-testid='test' name={''} label={''} />);
        expect(screen.getByTestId('test')).toBeVisible();
    });

});

