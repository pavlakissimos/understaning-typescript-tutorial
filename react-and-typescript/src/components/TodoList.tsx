import React from "react";

import './TodoList.css'

interface TodoListProps {
  items: {
    id: string;
    text: string;
  }[];
  onDeleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ items, onDeleteTodo }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <span>{item.text}</span>
          <button type="button" onClick={() => onDeleteTodo(item.id)}>
            DELETE
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
