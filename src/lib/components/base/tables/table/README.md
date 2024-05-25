# Table 1.0 Component

## Overview

React table component with many features like drag-drop table cells, resize, check functionality, drop-down tables, and edit tables in many ways.

## Default style
[Figma Design](https://www.figma.com/design/Q3aIuqsK0HWrUrOElSFEIb/TORCH-Glare-V1.4.4?node-id=6298-203894&t=ugpSKRHXunUpmGz2-4)


## pre required

 - to make this component work you need to have two different components the table header component and the table body component with the table body container component.

 - your data cells or headers should contain id value.


#### the table header component.

- this component is the table header tag we use and should be rendered on the first row of the table.

- [for more see component README](../components/shared/tableHeaderCell/README.md)


#### the table body component.

- this component is the table data tag and should be rendered as data cell under the table header.

- [for more see component README](../components/shared/tableCell/README.md)


#### the table body container component.

- this component is to make table row to contain the table body cells children.

- [for more see component README](../table/components/tableCellContainer/README.md)




## implement 

```tsx
 import {Table} from 'torch-glare'

  const [data, setData] = useState([
    {
      label: 'data 1',
      id: "1",
      cells: ['data 1', 'data 1', 'data 1', 'data 1',]
    },
    {
      label: 'data 2',
      id: "2",
      cells: ['data 2', 'data 2', 'data 2', 'data 2',]
    }
  ])

    <Table
        table_header_cells_children_data={data} // your table data  
        table_header_cells_children_setter_data={setData} // your table data setter (set state)


        // render the table headers
        table_header_cells_children={

          data.map((e: any, i) => {
            return <TableHeaderCell 
            resizable={true} 
            component_size='M' 
            key={e.id} 
            label={e.label} 
            id={e.id}
            />
          })
        }

        // render the table data cells
        // this will render the cells horizontally 
        // you should filter your data to render it vertically

        table_body_cells_children={

          data.map((e) => {
            // the table row 
            return <TableCellContainer isChecked={false}>
            
              {filteredData.map((j: any) => {
                return <TableCell
                  key={j}
                  name={j}
                  component_type={'Input-DropList'}
                  cellLabel={j}
                  secondary_cell_label={j}
                  component_size='M'
                />
              })}

            </TableCellContainer>
          })
        }
      />
```








  
 







