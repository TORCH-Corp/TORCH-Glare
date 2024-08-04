import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { StepperTab } from '../../../../lib'

type StoryProps = ComponentProps<typeof StepperTab> & {
    buttonText: string;
};

const meta: Meta<StoryProps> = {
    component: StepperTab,
    title: 'Components/Steppers/StepperTab',
    argTypes: {
        stepper_counter: {
            control: 'number',
            description: 'Numeric label of the stepper tab, typically used to denote the step number in a sequence.',
            defaultValue: 1, // Default value can be adjusted as necessary
        },
        stepper_label: {
            control: 'text',
            description: 'Main label text of the stepper tab.',
            defaultValue: 'Step',
        },
        is_selected: {
            control: 'boolean',
            description: 'Indicates if the stepper tab is currently selected.',
            defaultValue: false,
        },
        is_completed: {
            control: 'boolean',
            description: 'Indicates if the stepper tab has been completed.',
            defaultValue: false,
        },
        is_negative: {
            control: 'boolean',
            description: 'Indicates if the stepper tab should display in a negative styling, typically for errors or warnings.',
            defaultValue: false,
        }
    }
};

export default meta;

type Story = StoryObj<StoryProps>;

export const StepperTab_Playground: Story = {
    args: {
        stepper_label: "Label",
        stepper_counter: 1
    },
    render: ({ ...args }) => {
        return <StepperTab {...args} />;
    },
};



