import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { DropDownMenuItem } from '../../../../lib'

type StoryProps = ComponentProps<typeof DropDownMenuItem> & {
};

const meta: Meta<StoryProps> = {
    component: DropDownMenuItem,
    title: 'Components/DropDowns/DropDownMenuItem',
};

export default meta;

type Story = StoryObj<StoryProps>;

export const DropDownMenuItem_Playground: Story = {
    args: {
        component_style: 'System-Style',
        component_label: 'DropDownMenuItem Playground',
    },
    render: ({ ...args }) => {
        return <DropDownMenuItem {...args} />
    },
};



