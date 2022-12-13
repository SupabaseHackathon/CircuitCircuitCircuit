import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useEffect } from 'react';
import './Component.css';

type Position = {
  x: number;
  y: number;
};

export type Component = {
  id: string;
  isDragging: boolean;
  position: Position;
};

type Props = {
  component: Component;
};

export const Component = ({ component }: Props) => {
  const { attributes, listeners, setNodeRef, transform, active, node } =
    useDraggable({
      id: component.id,
    });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      className="component"
      ref={setNodeRef}
      style={{
        ...style,
        top: component.position.y,
        left: component.position.x,
        backgroundColor: component.isDragging ? 'green' : 'white',
      }}
      {...listeners}
      {...attributes}
    ></div>
  );
};
