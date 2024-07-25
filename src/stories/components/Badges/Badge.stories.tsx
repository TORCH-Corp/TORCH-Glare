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
        badge_style: {
            options: ["badge-green",
                "badge-green-light",
                "badge-cocktail-green",
                "badge-yellow",
                "badge-red-orange",
                "badge-red-light",
                "badge-rose",
                "badge-purple",
                "badge-blue-purple",
                "badge-blue",
                "badge-navy",
                "badge-gray"],
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
        selected: false
    },
    render: ({ ...args }) => {
        return <Badge {...args} />;
    },
};



