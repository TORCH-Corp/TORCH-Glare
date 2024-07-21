import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { Alert } from '../../lib'
import '../../lib/styles/colors/colorMapping/default.css'

type StoryProps = ComponentProps<typeof Alert> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: Alert,
    tags: ['autodocs'],
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

export const AlertStory: Story = {
    args: {
        component_label: 'Hello',
        component_state: 'Info',
    },
    render: ({ ...args }) => {
        return <Alert {...args} />;
    },
};



