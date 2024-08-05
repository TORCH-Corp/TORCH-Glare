import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';
import { Switcher } from '@/index'

type StoryProps = ComponentProps<typeof Switcher>

const meta: Meta<StoryProps> = {
    component: Switcher,
    title: 'Components/Switchers/Switcher',
    argTypes: {

    }
};

export default meta;

type Story = StoryObj<StoryProps>;

const SwitcherWrapper: React.FC<StoryProps> = (props) => {

    const [isActive, setIsActive] = useState<boolean>(false);
    return (
        <Switcher
            {...props}
            active={isActive}
            onClick={() => setIsActive(!isActive)} />
    );
};


export const Switcher_Playground: Story = {
    args: {
        active_label: 'Active',
        disabled_label: 'Disabled',
    },
    render: ({ ...args }) => {
        return <SwitcherWrapper {...args} />;
    },
};




