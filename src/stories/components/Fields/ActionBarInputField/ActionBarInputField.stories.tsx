import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { ActionBarInputField, Button } from '../../../../lib'

type StoryProps = ComponentProps<typeof ActionBarInputField> & {
};

const meta: Meta<StoryProps> = {
    component: ActionBarInputField,
    title: 'Components/Fields/ActionBarInputField',
};

export default meta;

type Story = StoryObj<StoryProps>;

export const DropDownButton_Playground: Story = {
    args: {
        name: "action-bar-input-field",
        action_button_children: <Button component_size="L" left_icon={<i className="ri-mail-download-line"></i>} />
    },
    render: ({ ...args }) => {
        return <ActionBarInputField {...args} />;
    },
};



