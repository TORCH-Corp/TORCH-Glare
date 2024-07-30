import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { LabelLessInput } from '../../../../lib'


type StoryProps = ComponentProps<typeof LabelLessInput>

const meta: Meta<StoryProps> = {
    component: LabelLessInput,
    title: 'Components/Fields/LabelLessInput',
    argTypes: {
        name: {
            control: 'text',
            description: 'Name linking input to label, important for accessibility.'
        },
        label: {
            control: 'text',
            description: 'Label text for the input field.'
        },
        required_label: {
            control: 'text',
            description: 'Text to display when the field is required.'
        },
        secondary_label: {
            control: 'text',
            description: 'Secondary label text.'
        },
        component_size: {
            options: ['S', 'M', 'L'],
            control: {
                type: 'select',
            },
            description: 'Size style of the component.'
        },
        theme: {
            options: ['System-Style', ''],
            control: {
                type: 'select',
            },
            description: 'Color theme of the component.'
        },
        negative: {
            control: 'boolean',
            description: 'Enables a negative color theme.'
        },
        drop_down_list_child: {
            control: 'object',
            description: 'Dropdown list to be added, if passed.'
        },
        trailing_label: {
            control: 'text',
            description: 'Trailing label text.'
        },
        action_button: {
            control: 'object',
            description: 'Action button to add at the end of the input.'
        },
        left_side_icon: {
            control: 'object',
            description: 'Icon to add on the left side of the input.'
        },
        badges_children: {
            control: 'object',
            description: 'Badges components to be added inside the component.'
        },
        error_message: {
            control: 'text',
            description: 'Error message to show via a tooltip when the input has an error.'
        }
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const LabelLessInput_Playground: Story = {
    args: {
        name: 'input-field',
        label: 'label',
    },

    render: ({ ...args }) => {
        return <LabelLessInput {...args} />;
    },
};



