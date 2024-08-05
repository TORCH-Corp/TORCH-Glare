import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentProps } from 'react';
import { DropDownMenu, DropDownMenuItem, DynamicContainer } from '@/index'



type StoryProps = ComponentProps<typeof DynamicContainer>

const meta: Meta<StoryProps> = {
    component: DynamicContainer,
    title: 'Helpers/DynamicContainer',
    argTypes: {
        children: {
            control: 'text',
            description: 'Content to be rendered inside the container.',
            defaultValue: 'Dynamic Content',
            table: {
                type: { summary: 'ReactNode' },
                defaultValue: { summary: 'Dynamic Content' },
            },
        },
        active: {
            control: 'boolean',
            description: 'Determines if the component is visible.',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
            },
        },
        onClick: {
            action: 'clicked',
            description: 'Optional click handler for the component.',
            table: {
                type: { summary: '() => void' },
            },
        },
        style: {
            control: 'object',
            description: 'Optional styles to be applied to the component.',
            table: {
                type: { summary: 'CSSProperties' },
            },
        },
    },
    args: {
        onClick: fn(),
    },// 
};

export default meta;

type Story = StoryObj<StoryProps>;

export const DynamicContainer_Playground: Story = {
    args: {
        active: true
    },
    render: ({ ...args }) => {
        return <DynamicContainer style={{ maxWidth: '500px' }} {...args} >
            <DropDownMenu component_style="System-Style">
                <DropDownMenuItem component_style='System-Style' component_label={'Option Example'} element_name={'example'} />
                <DropDownMenuItem component_style='System-Style' component_label={'Option Example 2'} element_name={'example2'} />
            </DropDownMenu>
        </DynamicContainer>;
    },
};



