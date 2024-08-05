import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { ButtonField, Button } from '@/index'

type StoryProps = ComponentProps<typeof ButtonField>

const meta: Meta<StoryProps> = {
    component: ButtonField,
    title: 'Components/Fields/ButtonField',
};

export default meta;

type Story = StoryObj<StoryProps>;

export const ButtonField_Playground: Story = {
    args: {
        with_divider: true,
        style: { width: "200px" }
    },
    render: ({ ...args }) => {
        return <ButtonField {...args} >
            <Button component_size="L" left_icon={<i className="ri-mail-download-line"></i>} />
            <Button component_size="L" left_icon={<i className="ri-mail-download-line"></i>} />
            <Button component_size="L" left_icon={<i className="ri-mail-download-line"></i>} />
        </ButtonField>;
    },
};



