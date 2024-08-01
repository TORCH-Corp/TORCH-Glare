import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Switcher } from '../../../lib'

type StoryProps = ComponentProps<typeof Switcher>

const meta: Meta<StoryProps> = {
    component: Switcher,
    title: 'Components/Switchers/Switcher',
    argTypes: {

    }
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Switcher_Playground: Story = {
    args: {
        active_label: 'Active',
        disabled_label: 'Disabled'
    },
    render: ({ ...args }) => {
        return <Switcher {...args} />;
    },
};



