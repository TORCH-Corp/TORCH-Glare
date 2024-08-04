import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';
import { DropDownButtonResultShow, DropDownMenu, DropDownMenuItem } from '../../../../lib'

type StoryProps = ComponentProps<typeof DropDownButtonResultShow>

const meta: Meta<StoryProps> = {
    component: DropDownButtonResultShow,
    title: 'Components/DropDowns/DropDownButtonResultShow',
};

export default meta;

type Story = StoryObj<StoryProps>;

const DropDownButtonWrapper: React.FC<StoryProps> = (props) => {

    const [value, setValue] = useState<string>('None Selection');
    return (
        <DropDownButtonResultShow {...props} selected_value={value} drop_down_list_child={
            <DropDownMenu>
                <DropDownMenuItem onClick={() => setValue("Option Number One")} component_style='System-Style' component_label={'Option Number One'} element_name={'example'} />
            </DropDownMenu>
        } />
    );
};


export const DropDownButton_Playground: Story = {
    args: {
        component_size: "M",
    },
    render: ({ ...args }) => {
        return <DropDownButtonWrapper {...args} />;
    },
};



