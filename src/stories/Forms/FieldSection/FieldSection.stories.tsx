import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { FieldSection } from '../../../lib'

type StoryProps = ComponentProps<typeof FieldSection> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: FieldSection,
    argTypes: {
        name: { control: 'text', description: 'Important to link the component' },
        label: { control: 'text', description: 'Label of the component' },
        required_label: { control: 'text', description: 'Required style label' },
        secondary_label: { control: 'text', description: 'Secondary style label' },
        warning_label: { control: 'text', description: 'Alert component with warning style' },
        error_label: { control: 'text', description: 'Alert component with error style' },
        negative: { control: 'boolean', description: 'Apply negative style' },
        drop_down_list_child: { control: 'object', description: 'Dropdown list to show if not null' },
        trailing_label: { control: 'text', description: 'Trailing label to show if not null' },
        action_button: { control: 'object', description: 'Action button to show if not null' },
        left_side_icon: { control: 'object', description: 'Left side icon to show' },
        badges_children: { control: 'object', description: 'Badges children' },
        error_message: { control: 'text', description: 'Tooltip with error message if not null' },
        component_size: {
            control: { type: 'radio', options: ['S', 'M', 'L'] },
            description: 'Change the size style of the component'
        },
        theme: {
            control: { type: 'radio', options: ['System-Style', ''] },
            description: 'Change the theme style of the component'
        }
    }
};

export default meta;

type Story = StoryObj<StoryProps>;

export const FieldSectionStory: Story = {
    args: {
        name: "fieldSection",
        label: "Field Section",
        required_label: "Required Label",
    },
    render: ({ ...args }) => {
        return <FieldSection {...args} />;
    },
};



