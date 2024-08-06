import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps, useState } from 'react';
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
    render: () => {

        const [data, setData] = useState([
            {
                label: 'User Name',
                id: '1',
                cells: ['John Doe', 'Jane Smith'],
            },
            {
                label: 'User Email',
                id: '2',
                cells: ['jane.smith@example.com', 'john.doe@example.com',],
            },
            {
                label: 'User Phone Number',
                id: '3',
                cells: ['555-1234', '555-5678'],
            }
        ]);

        const renderTableHeaderCells = () => {
            return data.map((item) => (
                <TableHeaderCell
                    key={item.id}
                    resizable={true}
                    component_size="M"
                    label={item.label}
                    id={item.id}
                />
            ));
        };

        const renderTableBodyCells = () => {
            const numRows = Math.max(...data.map(item => item.cells.length));
            const rows = [];

            for (let i = 0; i < numRows; i++) {
                rows.push(
                    <TableCellContainer
                        key={i}
                        isChecked={false}
                    >
                        {data.map(item => (
                            <TableCell
                                key={`${item.id}-${i}`}
                                cellLabel={item.cells[i] || ''}
                                component_size="M"
                            />
                        ))}
                    </TableCellContainer>
                );
            }

            return rows;
        };
        return (<Table
            table_header_cells_children_data={data}
            table_header_cells_children_setter_data={setData}
            table_header_cells_children={renderTableHeaderCells()}
            table_body_cells_children={renderTableBodyCells()} />);
    },
};
