import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { CheckboxLabel } from '@/index'

type StoryProps = ComponentProps<typeof CheckboxLabel>

const meta: Meta<StoryProps> = {
    component: CheckboxLabel,
    title: 'Components/CheckBoxes/CheckboxLabel',
    argTypes: {
        component_type: {
            options: ['checkbox', 'radio'],
            control: {
                type: 'select',
            },
        }
    },
    args: {
        onChange: fn()
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const CheckboxLabel_Playground: Story = {
    args: {
        label: "CheckboxLabel Playground",
        check_box_name: "default-checkbox",
    },
    render: ({ ...args }) => {
        return <CheckboxLabel {...args} />;
    },
};



