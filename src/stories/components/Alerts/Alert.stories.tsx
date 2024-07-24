import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { Alert } from '../../../lib'

type StoryProps = ComponentProps<typeof Alert> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: Alert,
    title: 'Components/Alerts/Alert',
    argTypes: {
        component_state: {
            options: ['Info', "Warning", "Error", "Success"],
            control: {
                type: 'select',
            },
        }
    },
    args: {
        onClick: fn(),
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Alert_Playground: Story = {
    args: {
        component_label: 'Alert Playground',
        component_state: 'Info',
    },
    render: ({ ...args }) => {
        return <Alert {...args} />;
    },
};



