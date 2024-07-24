import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Datepicker } from '../../../lib'
import { fn } from '@storybook/test';

type StoryProps = ComponentProps<typeof Datepicker> & {
};

const meta: Meta<StoryProps> = {
    component: Datepicker,
    title: 'Components/DatePickers/DatePicker',
    args: {
        onChange: fn(),
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Datepicker_Playground: Story = {
    args: {
        name: "date-picker",
        component_style: "presentation"
    },
    render: ({ ...args }) => {
        return <Datepicker {...args} />;
    },
};



