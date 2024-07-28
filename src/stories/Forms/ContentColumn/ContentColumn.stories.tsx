import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { ContentColumn } from '../../../lib'

type StoryProps = ComponentProps<typeof ContentColumn> & {
    buttonText: string;
};
const meta: Meta<StoryProps> = {
    component: ContentColumn,
    title: 'Forms/ContentColumn',
    argTypes: {
        component_label: { control: 'text', description: 'The label of the component' },
        secondary_label: { control: 'text', description: 'The secondary style label' },
        required_label: { control: 'text', description: 'The required style label' },
        warning_label: { control: 'text', description: 'The warning component label', },
        error_label: { control: 'text', description: 'The error component label' },
        component_size: {
            control: { type: 'radio', options: ['S', 'M', 'L'] },
            description: 'This is used to change the size style of the component'
        },
        name: { control: 'text', description: 'This is important to link the component' },
    }
};

export default meta;

type Story = StoryObj<StoryProps>;

export const ContentColumn_Playground: Story = {
    args: {
        component_label: "Primary Label",
        secondary_label: "Secondary Label",
        required_label: "Required Label",
        warning_label: "Warning Label",
        error_label: "Error Label",
        component_size: "M",
        name: "contentColumn"
    },
    render: ({ ...args }) => {
        return <ContentColumn {...args} />;
    },
};



