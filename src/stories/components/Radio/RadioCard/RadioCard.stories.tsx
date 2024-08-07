import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { RadioCard } from '@/index'
import { fn } from '@storybook/test';

type StoryProps = ComponentProps<typeof RadioCard>

const meta: Meta<StoryProps> = {
    component: RadioCard,
    title: 'Components/Radio/RadioCard',
    argTypes: {
        is_selected: {
            control: {
                type: 'boolean',
            },
            description: 'Sets the size of the label component.'
        },
        label: {
            control: 'text',
            description: 'Main label text.'
        },
        description_child: {
            control: 'text',
            description: 'Text displayed with description style for additional information.'
        },
        learn_more_label: {
            control: 'text',
            description: 'button label text.'
        },

    },
    args: {
        learn_more_click_event: fn(),
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const RadioCard_Playground: Story = {
    args: {
        label: "Radio Header",
        name: "radio-example",
        description_child: <p> "Your Company Account Will be Linked to Your Company Exist Domain"</p>,
        learn_more_label: "Learn More"
    },
    render: ({ ...args }) => {
        return <RadioCard {...args} />;
    },
};



