import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { DropDownButtonResultShow, DropDownMenu, DropDownMenuItem } from '../../../../lib'

type StoryProps = ComponentProps<typeof DropDownButtonResultShow>

const meta: Meta<StoryProps> = {
    component: DropDownButtonResultShow,
    title: 'Components/DropDowns/DropDownButtonResultShow',
};

export default meta;

type Story = StoryObj<StoryProps>;

export const DropDownButton_Playground: Story = {
    args: {
        component_size: "M",
        selected_value: "DropDownButton Playground",
        drop_down_list_child:
            <DropDownMenu>
                <DropDownMenuItem component_style='System-Style' component_label={'Option Example'} element_name={'example'} />
            </DropDownMenu>
    },
    render: ({ ...args }) => {
        return <DropDownButtonResultShow {...args} />;
    },
};



