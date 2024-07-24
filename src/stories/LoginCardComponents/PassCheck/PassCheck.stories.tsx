import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { PassCheck } from '../../../lib'

type StoryProps = ComponentProps<typeof PassCheck> & {
};

const meta: Meta<StoryProps> = {
    component: PassCheck,
    args: {
        onClick: fn(),
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const PassCheckStory: Story = {
    args: {
        value: "123456789"
    },
    render: ({ ...args }) => {
        return <PassCheck {...args} />;
    },
};



