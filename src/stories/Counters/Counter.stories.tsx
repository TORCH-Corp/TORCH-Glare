import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Counter } from '../../lib'

type StoryProps = ComponentProps<typeof Counter> & {
};

const meta: Meta<StoryProps> = {
    component: Counter,
};

export default meta;

type Story = StoryObj<StoryProps>;

export const CounterStory: Story = {
    args: {
        label: 30,
    },
    render: ({ ...args }) => {
        return <Counter {...args} />;
    },
};



