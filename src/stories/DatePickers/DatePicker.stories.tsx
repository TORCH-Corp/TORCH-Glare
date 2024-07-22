import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Datepicker } from '../../lib'
import { fn } from '@storybook/test';

type StoryProps = ComponentProps<typeof Datepicker> & {
};

const meta: Meta<StoryProps> = {
    component: Datepicker,
    args: {
        onChange: fn(),
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const DatepickerStory: Story = {
    args: {
        name: "date-picker",
        component_style: "presentation"
    },
    render: ({ ...args }) => {
        return <Datepicker {...args} />;
    },
};



