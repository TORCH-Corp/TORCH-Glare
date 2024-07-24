import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { LoginButton } from '../../../lib'

type StoryProps = ComponentProps<typeof LoginButton> & {
};

const meta: Meta<StoryProps> = {
    component: LoginButton,
    argTypes: {
    },
    args: {
        onClick: fn(),
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const LoginButtonStory: Story = {
    args: {
        children: "Label"
    },
    render: ({ children, ...args }) => {
        return <LoginButton {...args}>{children}</LoginButton>;
    },
};



