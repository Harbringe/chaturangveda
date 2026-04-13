'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export interface SortableItem {
  id: string;
}

interface Props<T extends SortableItem> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}

export default function SortableList<T extends SortableItem>({
  items, onChange, renderItem, onEdit, onDelete,
}: Props<T>) {
  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onChange(reordered);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(prov) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    style={{
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 7,
                      padding: '0.6rem 0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      ...prov.draggableProps.style,
                    }}
                  >
                    <div
                      {...prov.dragHandleProps}
                      style={{ color: '#a0aec0', cursor: 'grab', fontSize: '1.1rem', lineHeight: 1, userSelect: 'none' }}
                    >
                      ⠿
                    </div>
                    <div style={{ flex: 1 }}>{renderItem(item, index)}</div>
                    <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        style={{ background: '#fff', color: '#004D99', border: '1px solid #bee3f8', padding: '0.25rem 0.6rem', borderRadius: 4, fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        style={{ background: '#fff5f5', color: '#c53030', border: '1px solid #fed7d7', padding: '0.25rem 0.6rem', borderRadius: 4, fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
