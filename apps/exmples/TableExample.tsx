import { Badge } from "@/components/Badge";
import {
  SubTableButton,
  Table,
  TableBody,
  TableCell,
  TableCheckbox,
  TableFooter,
  TableFooterButton,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { cn } from "@/utils/cn";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function TableExample() {
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ];

  // Define column structure
  const [columns, setColumns] = useState([
    { id: "invoice", label: "Invoice" },
    { id: "paymentStatus", label: "Status" },
    { id: "paymentMethod", label: "Method" },
    { id: "totalAmount", label: "Amount" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setColumns((items: any) => {
        const oldIndex = items.findIndex((item: any) => item.id === active.id);
        const newIndex = items.findIndex((item: any) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <h1
        className={cn(
          "text-xl font-bold mb-8",
          "text-content-system-global-primary"
        )}
      >
        Table Preview
      </h1>
      <div className="overflow-auto">

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead isDummy></TableHead>
              <TableHead isDummy>
                <TableCheckbox id="checkbox-12" />
              </TableHead>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={columns.map((col) => col.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {columns.map((column) => (
                    <SortableHeader key={column.id} id={column.id}>
                      {column.label}
                    </SortableHeader>
                  ))}
                </SortableContext>
              </DndContext>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell isDummy>
                  <SubTableButton />
                </TableCell>
                <TableCell isDummy>
                  <TableCheckbox id={`${invoice.invoice}-checkbox`} />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                    <Badge label={invoice[column.id as keyof typeof invoice]} />
                  </TableCell>
                ))}
                <TableCell isDummy style={{ width: "100vw" }}></TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableFooterButton>
              <i className="ri-add-line"></i> Add
            </TableFooterButton>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

const SortableHeader = ({
  id,
  children,
  ...props
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <TableHead
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </TableHead>
  );
};
