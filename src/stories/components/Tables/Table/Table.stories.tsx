import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import { Table, TableCell, TableCellContainer, TableHeaderCell } from '@/index'

type StoryProps = ComponentProps<typeof Table>

const meta: Meta<StoryProps> = {
    component: Table,
    title: 'Components/Tables/Table',
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Tables_Playground: Story = {
    args: {
        table_header_cells_children_data: [],
        table_header_cells_children_setter_data: () => { },
        table_header_cells_children: <TableHeaderCell
            resizable={true}
            component_size="M"
            label={'Header Example'}
            id={'1'}
        />,
        table_body_cells_children: <TableCellContainer isChecked={false}>
            <TableCell
                cellLabel={'Cell Example'}
                component_size="M"
            />
        </TableCellContainer>
    },
    render: ({ ...args }) => {
        return <Table {...args} />;
    },
};
