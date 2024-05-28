import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Alert from '.';

describe('Alert component', () => {

    it('renders the component label', () => {
        render(<Alert component_label="Test Label" component_state="Info" />);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('applies Info Style correctly', () => {
        render(<Alert component_label="Label" component_state="Info" data-testid='info-style' />);
        expect(screen.getByTestId('info-style')).toBeInTheDocument();
        expect(screen.getByTestId('info-style')).toHaveClass("glare-alert-Info-state");
    });

    it('applies Error Style correctly', () => {
        render(<Alert component_label="Label" component_state="Error" data-testid='error-style' />);
        expect(screen.getByTestId('error-style')).toBeInTheDocument();
        expect(screen.getByTestId('error-style')).toHaveClass("glare-alert-Error-state");
    });

    it('applies Success Style correctly', () => {
        render(<Alert component_label="Label" component_state="Success" data-testid='success-style' />);
        expect(screen.getByTestId('success-style')).toBeInTheDocument();
        expect(screen.getByTestId('success-style')).toHaveClass("glare-alert-Success-state");
    });

    it('applies Success Style correctly', () => {
        render(<Alert component_label="Label" component_state="Warning" data-testid='warning-style' />);
        expect(screen.getByTestId('warning-style')).toBeInTheDocument();
        expect(screen.getByTestId('warning-style')).toHaveClass("glare-alert-Warning-state");
    });

});
