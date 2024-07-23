import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { RingLoading } from '../../../lib'

type StoryProps = ComponentProps<typeof RingLoading> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: RingLoading,
    argTypes: {
        component_size: {
            options: ['S', 'M', 'L'],
            control: {
                type: 'select',
            },
            description: 'Sets the size of the label component.'
        },
    }
};

export default meta;

type Story = StoryObj<StoryProps>;

export const RingLoadingStory: Story = {
    args: {
        children: "Loading...",
        component_size: "L"
    },
    render: ({ ...args }) => {
        return <RingLoading {...args} />;
    },
};



