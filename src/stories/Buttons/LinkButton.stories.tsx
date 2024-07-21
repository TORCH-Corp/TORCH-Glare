import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { LinkButton } from '../../lib'
import '../../lib/styles/colors/colorMapping/default.css'

type StoryProps = ComponentProps<typeof LinkButton> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: LinkButton,
    tags: ['autodocs'],
    argTypes: {
        component_size: {
            options: ['S', 'M', 'L'],
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

export const LinkButtonStory: Story = {
    args: {
        children: 'Hello',
        component_size: 'S',
        dir: "ltr"
    },
    render: ({ children, ...args }) => {
        return <LinkButton {...args}>{children}</LinkButton>;
    },
};



