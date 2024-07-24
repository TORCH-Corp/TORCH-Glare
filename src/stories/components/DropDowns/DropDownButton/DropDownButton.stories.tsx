import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { DropDownButton, DropDownMenu, DropDownMenuItem } from '../../../../lib'

type StoryProps = ComponentProps<typeof DropDownButton> & {
};

const meta: Meta<StoryProps> = {
    component: DropDownButton,
    title: 'Components/DropDowns/DropDownButton',
};

export default meta;

type Story = StoryObj<StoryProps>;

export const DropDownButton_Playground: Story = {
    args: {
        component_size: "S",
        component_label: "DropDownButton Playground",
        drop_down_list_child:
            <DropDownMenu>
                <DropDownMenuItem component_style='System-Style' component_label={'Option Example'} element_name={'example'} />
            </DropDownMenu>
    },
    render: ({ ...args }) => {
        return <DropDownButton {...args} />;
    },
};



