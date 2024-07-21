import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { Button } from '../../lib'
import '../../lib/styles/colors/colorMapping/default.css'

type StoryProps = ComponentProps<typeof Button> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        component_style: {
            options: ["BlueSecStyle", "YelSecStyle", "RedSecStyle", "BorderStyle", "PrimeContStyle", "BlueContStyle", "RedContStyle"],
            control: {
                type: 'select',
            },
        },
        component_size: {
            options: ['S', 'M', 'L'],
            control: {
                type: 'select',
            },
        },
        is_loading: {
            options: [true, false],
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

export const ButtonStory: Story = {
    args: {
        children: 'Hello',
        component_style: 'RedContStyle',
        component_size: 'S',
    },
    render: ({ children, ...args }) => {
        return <Button {...args}>{children}</Button>;
    },
};



