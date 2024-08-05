import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Counter } from '@/index'

type StoryProps = ComponentProps<typeof Counter>

const meta: Meta<StoryProps> = {
    component: Counter,
    title: 'Components/Counters/Counter',
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Counter_Playground: Story = {
    args: {
        label: 30,
    },
    render: ({ ...args }) => {
        return <Counter {...args} />;
    },
};



