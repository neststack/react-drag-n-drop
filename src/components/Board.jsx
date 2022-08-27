import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import uuid from 'uuid/v4';

const itemsFromBackend = [
  { id: uuid(), content: 'First task title' },
  { id: uuid(), content: 'Second task title' },
  { id: uuid(), content: 'Third task title' },
  { id: uuid(), content: 'Fourth task title' },
  { id: uuid(), content: 'Fifth task title' },
];

const columnsFromBackend = {
  [uuid()]: {
    name: 'To do',
    items: itemsFromBackend,
  },
  [uuid()]: {
    name: 'Doing',
    items: [],
  },
  [uuid()]: {
    name: 'In Review',
    items: [],
  },
  [uuid()]: {
    name: 'Pushed',
    items: [],
  },
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function Board() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div className='w-screen p-4 flex flex-row justify-center flex-nowrap overflow-y-hidden'>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div
              className='flex flex-col justify-start items-center'
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div className='m-2'>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`p-4 w-[250px] min-h-[100px] ${
                          snapshot.isDraggingOver
                            ? 'bg-blue-200'
                            : 'bg-gray-300'
                        }`}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`select-none p-4 mb-2 min-h-[20px] bg-white text-black`}
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default Board;
