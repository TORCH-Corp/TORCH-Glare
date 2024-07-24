import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { TabFormItem } from '../../../../lib'

type StoryProps = ComponentProps<typeof TabFormItem> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: TabFormItem,
    title: 'Components/Tabs/TabFormItem',
    argTypes: {
        componentType: {
            options: ['Top', 'Side'],
            control: {
                type: 'select',
            }
        },
    }
};

export default meta;

type Story = StoryObj<StoryProps>;

export const TabFormItem_Playground: Story = {
    args: {
        children: "Label",
    },
    render: ({ ...args }) => {
        return <TabFormItem {...args} />;
    },
};



