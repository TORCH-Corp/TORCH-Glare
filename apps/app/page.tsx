'use client'
import { DataTable } from '@/components/DataTable'
import { InputField } from '@/components/InputField'
import { ColumnDef } from '@tanstack/react-table'

interface Person {
  id: string
  name: string
  email: string
  role: string
  input: string
}

const data: Person[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    input: 'input',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    input: 'input',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Editor',
    input: 'input',
  },
]

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'input',
    header: 'input',
    cell: ({ row }) => {
      return <InputField onTable type="text" defaultValue={row.original.input} onChange={(e) => {
        row.original.input = e.target.value
      }} />
    },
  },
]

export default function Page() {
  return (
    <DataTable
      columns={columns}
      data={data}
    />
  )
}




