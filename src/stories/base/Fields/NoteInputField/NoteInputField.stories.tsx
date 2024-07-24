import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { NoteInputField } from '../../../../lib'


type StoryProps = ComponentProps<typeof NoteInputField> & {
};

const meta: Meta<StoryProps> = {
    component: NoteInputField,
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
        label_style: {
            options: ['horizontal', 'vertical', ''],
            control: {
                type: 'select',
            },
            description: 'Size style of the component.'
        },
        negative: {
            control: 'boolean',
            description: 'Enables a negative color theme.'
        },
        error_message: {
            control: 'text',
            description: 'Error message to show via a tooltip when the input has an error.'
        }
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const NoteInputFieldStory: Story = {
    args: {
        name: 'input-field',
    },

    render: ({ ...args }) => {
        return <NoteInputField {...args} />;
    },
};



