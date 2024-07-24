import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { LinkButton } from '../../../../lib'

type StoryProps = ComponentProps<typeof LinkButton> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: LinkButton,
    argTypes: {
        component_size: {
            options: ['S', 'M'],
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
        children: 'LinkButton Playground',
        component_size: 'M',
        dir: "ltr"
    },
    render: ({ children, ...args }) => {
        return <LinkButton {...args}>{children}</LinkButton>;
    },
};



