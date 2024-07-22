import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { DropDownMenu, DropDownMenuItem } from '../../../lib'

type StoryProps = ComponentProps<typeof DropDownMenu> & {
};

const meta: Meta<StoryProps> = {
    component: DropDownMenu,
};

export default meta;

type Story = StoryObj<StoryProps>;

export const DropdownMenuStory: Story = {
    args: {
        component_style: 'System-Style'
    },
    render: ({ ...args }) => {
        return <DropDownMenu {...args} >
            <DropDownMenuItem component_style='System-Style' component_label={'Option Example'} element_name={'example'} />
            <DropDownMenuItem component_style='System-Style' component_label={'Option Example'} element_name={'example2'} />
            <DropDownMenuItem component_style='System-Style' component_label={'Option Example'} element_name={'example3'} />
        </DropDownMenu>;
    },
};



