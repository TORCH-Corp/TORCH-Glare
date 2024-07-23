import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { RadioLabel } from '../../../lib'

type StoryProps = ComponentProps<typeof RadioLabel> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: RadioLabel,
    argTypes: {
        component_size: {
            options: ['S', 'M', 'L'],
            control: {
                type: 'select',
            },
            description: 'Sets the size of the label component.'
        },
        label: {
            control: 'text',
            description: 'Main label text.'
        },
        required_label: {
            control: 'text',
            description: 'Text displayed with required style, indicating a mandatory field.'
        },
        secondary_label: {
            control: 'text',
            description: 'Text displayed with secondary style for additional information.'
        },
    }
};

export default meta;

type Story = StoryObj<StoryProps>;

export const RingLoadingStory: Story = {
    args: {
        component_size: "M",
        label: "Label",
        name: "radio-example",
    },
    render: ({ ...args }) => {
        return <RadioLabel {...args} />;
    },
};



