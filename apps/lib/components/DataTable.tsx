'use client'

import * as React from "react"
import { CSS } from '@dnd-kit/utilities'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./Table"
import { Checkbox } from "./Checkbox"

interface DataTableProps<TData extends { id: string | number }, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    theme?: "dark" | "light" | "default"
    onRowReorder?: (newData: TData[]) => void
}

export function DataTable<TData extends { id: string | number }, TValue>({
    columns,
    data,
    theme = "default",
    onRowReorder,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [items, setItems] = React.useState<TData[]>(data)
    const [rowSelection, setRowSelection] = React.useState({})

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        state: {
            sorting,
            rowSelection,
        },
    })

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item: any) => item.id === active.id)
            const newIndex = items.findIndex((item: any) => item.id === over.id)

            const newItems = arrayMove(items, oldIndex, newIndex)
            setItems(newItems)
            onRowReorder?.(newItems)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <Table theme={theme}>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            <TableHead isDummy ></TableHead>
                            <TableHead isDummy >
                                <Checkbox
                                    checked={table.getIsAllRowsSelected()}
                                    onCheckedChange={(checked) => {
                                        table.toggleAllRowsSelected(!!checked)
                                    }}
                                />
                            </TableHead>
                            {headerGroup.headers.map((header) => {
                                const sortHandler = header.column.getToggleSortingHandler()
                                return (
                                    <TableHead
                                        key={header.id}
                                        onSort={sortHandler ? () => sortHandler({}) : undefined}
                                        sortType={header.column.getIsSorted() as "asc" | "desc" | undefined}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        <SortableContext
                            items={table.getRowModel().rows.map(row => row.original)}
                            strategy={verticalListSortingStrategy}
                        >
                            {table.getRowModel().rows.map((row, i) => (
                                <SortableRow key={i + "row"} row={row} state={row.getIsSelected() ? "selected" : undefined}>
                                    <TableCell isDummy >
                                        <Checkbox
                                            checked={row.getIsSelected()}
                                            onCheckedChange={(checked) => {
                                                row.toggleSelected(!!checked)
                                            }}
                                        />
                                    </TableCell>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    <TableCell isDummy className="w-full" ></TableCell>
                                </SortableRow>
                            ))}
                        </SortableContext>
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </DndContext>
    )
}




interface SortableRowProps<TData> {
    row: Row<TData>
    children: React.ReactNode
    state?: "delete" | "update" | "add" | "selected" | "open"
}

function SortableRow<TData>({ row, children, state }: SortableRowProps<TData>) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: (row.original as any).id,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            state={state}
        >
            <TableCell
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
                isDummy
            >
                <i className="ri-draggable text-[18px]" />
            </TableCell>
            {children}
        </TableRow>
    )
} 