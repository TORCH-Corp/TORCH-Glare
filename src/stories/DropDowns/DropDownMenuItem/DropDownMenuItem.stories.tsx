import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { DropDownMenuItem } from '../../../lib'

type StoryProps = ComponentProps<typeof DropDownMenuItem> & {
};

const meta: Meta<StoryProps> = {
    component: DropDownMenuItem,
};

export default meta;

type Story = StoryObj<StoryProps>;

export const DropDownMenuItemStory: Story = {
    args: {
        component_style: 'System-Style',
        component_label: 'DropDownMenuItem Playground',
    },
    render: ({ ...args }) => {
        return <DropDownMenuItem {...args} />
    },
};



