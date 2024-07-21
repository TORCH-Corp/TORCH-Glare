import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { Badge } from '../../lib'
import '../../lib/styles/colors/colorMapping/default.css'

type StoryProps = ComponentProps<typeof Badge> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        badge_style: {
            options: [
                "badge-green",
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
                "badge-gray"
            ],
            control: {
                type: 'select',
            },
        }
    },
    args: {
        onClick: fn(),
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const BadgesStory: Story = {
    args: {
        label: "Hello",
        badge_style: "badge-blue"
    },
    render: ({ ...args }) => {
        return <Badge {...args} />;
    },
};



