import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useState } from 'react';
import { Component } from '../component/Component';
import './ComponentEditor.css';

type Props = {
  channel: RealtimeChannel;
};

export const ComponentEditor = ({ channel }: Props) => {
  const { setNodeRef } = useDroppable({
    id: 'component-editor',
  });
  const [components, setComponents] = useState<Component[]>([
    {
      id: 'comp-1',
      isDragging: false,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: 'comp-2',
      isDragging: false,
      position: {
        x: 200,
        y: 200,
      },
    },
  ]);

  channel.on('broadcast', { event: 'update-components' }, (payload) => {
    if (!payload.payload.components) return;
    setComponents(payload.payload.components);
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    setComponents((prev) => {
      const index = components.findIndex(
        (comp) => comp.id === event.active.id.toString()
      );
      const componentToUpdate = components[index];
      prev[index] = {
        ...componentToUpdate,
        isDragging: false,
        position: {
          x: componentToUpdate.position.x + event.delta.x,
          y: componentToUpdate.position.y + event.delta.y,
        },
      };
      return [...prev];
    });

    // Send new end position
    const res = await channel.send({
      type: 'broadcast',
      event: 'update-components',
      payload: { components: components },
    });
  };

  const handleDragStart = async (event: DragStartEvent) => {
    setComponents((prev) => {
      const index = components.findIndex(
        (comp) => comp.id === event.active.id.toString()
      );
      const componentToUpdate = components[index];
      prev[index] = {
        ...componentToUpdate,
        isDragging: true,
      };
      return [...prev];
    });

    // Allow for marking the component as being dragged.
    const res = await channel.send({
      type: 'broadcast',
      event: 'update-components',
      payload: { components: components },
    });
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToParentElement]}
    >
      <div id="__component-view-editor" ref={setNodeRef}>
        {components.map((comp, idx) => {
          return <Component key={idx} component={comp} />;
        })}
      </div>
    </DndContext>
  );
};
