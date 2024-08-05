import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Label } from '@/index'

type StoryProps = ComponentProps<typeof Label> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: Label,
    title: 'Components/Labels/Label',
    argTypes: {
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
        component_size: {
            options: ['S', 'M', 'L'],
            control: {
                type: 'select',
            },
            description: 'Sets the size of the label component.'
        },
        component_style: {
            options: ['vertical', 'horizontal', ''],
            control: {
                type: 'select',
            },
            description: 'Orientation of the labels within the component.'
        },
        as_child: {
            control: 'boolean',
            description: 'If true, applies the color theme of the parent component to the label.'
        },
        child_dir: {
            options: ['vertical', 'vertical-reverse', 'horizontal', ''],
            control: {
                type: 'select',
            },
            description: 'The direction of children elements within the label component.'
        },
        theme: {
            options: ['System-Style', ''],
            control: {
                type: 'select',
            },
            description: 'Sets the theme of the label component.'
        },
        disabled: {
            control: 'boolean',
            description: 'If true, disables the label.'
        },
        name: {
            control: 'text',
            description: 'The name of the label, important for linking the label with its parent component for accessibility.'
        }
    }

};

export default meta;

type Story = StoryObj<StoryProps>;

export const Label_Playground: Story = {
    args: {
        label: 'Label',
    },
    render: ({ ...args }) => {
        return <Label {...args} />;
    },
};



