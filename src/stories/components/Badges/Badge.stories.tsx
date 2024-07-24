import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { Badge } from '../../../lib'

type StoryProps = ComponentProps<typeof Badge> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: Badge,
    title: 'Components/Badges/Badge',
    argTypes: {
        badge_size: {
            options: ["S", "M"],
            control: {
                type: 'select',
            },
        },
    },
    args: {
        onCloseBtnClick: fn()
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Badge_Playground: Story = {
    args: {
        label: "Badge Playground",
        badge_style: "badge-blue",
        selected: false
    },
    render: ({ ...args }) => {
        return <Badge {...args} />;
    },
};



