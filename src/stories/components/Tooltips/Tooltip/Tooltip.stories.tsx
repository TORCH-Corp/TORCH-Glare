import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Tooltip } from '../../../../lib'

type StoryProps = ComponentProps<typeof Tooltip> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: Tooltip,
    title: 'Components/Tooltips/Tooltip',
    argTypes: {

    }
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Tooltip_Playground: Story = {
    args: {
        message: "Tooltip message",
    },
    render: ({ ...args }) => {
        return <Tooltip {...args} />;
    },
};



