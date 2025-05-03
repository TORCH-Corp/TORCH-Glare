'use client'
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Datepicker } from '@/components/DatePicker';
import { InputField } from '@/components/InputField';

// Task type definition
interface Task {
  id: string;
  content: string;
  dueDate?: Date;
}

// Column type definition
interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export default function Page() {
  // Initial task data
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({
    'task-1': { id: 'task-1', content: 'Create project structure', dueDate: new Date() },
    'task-2': { id: 'task-2', content: 'Design UI components' },
    'task-3': { id: 'task-3', content: 'Implement drag and drop' },
    'task-4': { id: 'task-4', content: 'Add task creation functionality' },
    'task-5': { id: 'task-5', content: 'Write documentation' },
  });

  // Column data
  const [columns, setColumns] = useState<{ [key: string]: Column }>({
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Review',
      taskIds: ['task-4'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: ['task-5'],
    },
  });

  // Column order
  const [columnOrder, setColumnOrder] = useState(['column-1', 'column-2', 'column-3', 'column-4']);

  // Handle drag end
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped back to its original position
    if (!destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)) {
      return;
    }

    // If moving within the same column
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const newTaskIds = Array.from(column.taskIds);

      // Reorder taskIds
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      // Create new column with updated taskIds
      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      };

      // Update state
      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });

      return;
    }

    // Moving from one column to another
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    // Remove from source column
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);

    // Add to destination column
    const destinationTaskIds = Array.from(destinationColumn.taskIds);
    destinationTaskIds.splice(destination.index, 0, draggableId);

    // Create new columns
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: destinationTaskIds,
    };

    // Update state
    setColumns({
      ...columns,
      [newSourceColumn.id]: newSourceColumn,
      [newDestinationColumn.id]: newDestinationColumn,
    });
  };

  // Add new task
  const [newTaskContent, setNewTaskContent] = useState('');
  const [newTaskDate, setNewTaskDate] = useState<Date | null>(null);

  const addTask = () => {
    if (!newTaskContent.trim()) return;

    // Create new task
    const taskId = `task-${Date.now()}`;
    const newTask = {
      id: taskId,
      content: newTaskContent,
      dueDate: newTaskDate || undefined,
    };

    // Add to tasks
    setTasks({
      ...tasks,
      [taskId]: newTask,
    });

    // Add to first column
    const firstColumn = columns['column-1'];
    setColumns({
      ...columns,
      'column-1': {
        ...firstColumn,
        taskIds: [...firstColumn.taskIds, taskId],
      },
    });

    // Reset form
    setNewTaskContent('');
    setNewTaskDate(null);
  };

  return (
    <div className='w-full h-full p-6'>
      <h1 className='text-2xl font-bold mb-6'>Task Manager</h1>

      {/* Add new task form */}
      <div className='bg-white p-4 rounded-lg shadow mb-6'>
        <h2 className='text-lg font-semibold mb-3'>Add New Task</h2>
        <div className='flex gap-4 flex-wrap'>
          <div className='flex-grow'>
            <InputField
              placeholder="Task description"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='w-48'>
            <Datepicker
              customInput={<InputField placeholder="Due date (optional)" />}
              onChange={(date: Date) => setNewTaskDate(date)}
              selected={newTaskDate || undefined}
            />
          </div>
          <button
            onClick={addTask}
            className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Task board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex gap-4 overflow-x-auto pb-4'>
          {columnOrder.map((columnId) => {
            const column = columns[columnId];
            const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

            return (
              <div key={column.id} className='bg-gray-100 rounded-lg p-4 min-w-[300px] w-1/4'>
                <h2 className='font-semibold text-lg mb-3'>{column.title}</h2>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className='min-h-[200px]'
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className='bg-white p-3 mb-2 rounded shadow'
                            >
                              <p>{task.content}</p>
                              {task.dueDate && (
                                <p className='text-sm text-gray-500 mt-1'>
                                  Due: {task.dueDate.toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

