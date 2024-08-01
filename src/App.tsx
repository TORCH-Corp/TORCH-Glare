import { useState } from 'react';
import { Table, TableCell, TableCellContainer, TableHeaderCell } from './lib';

function App() {
  const [data, setData] = useState([
    {
      label: 'data one',
      id: '1',
      cells: ['data 1', 'data 11', 'data 111', 'data 1111'],
    },
    {
      label: 'data two',
      id: '2',
      cells: ['data 2', 'data 222', 'data 2222', 'data 22222', 'data 222222', 'data 2222222', 'data 22222222'],
    },
    {
      label: 'data THREE',
      id: '3',
      cells: ['data 3', 'data 33', 'data 333', 'data 3333', 'data 33333', 'data 3333333', 'data 33333333', 'data 333333333', 'data 3333333333'],
    }
  ])

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

  return (
    <Table
      table_header_cells_children_data={data}
      table_header_cells_children_setter_data={setData}
      table_header_cells_children={renderTableHeaderCells()}
      table_body_cells_children={renderTableBodyCells()} />
  );
}

export default App;
