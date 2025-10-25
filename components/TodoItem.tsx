
import React from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../services/firebase';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const todoRef = doc(firestore, 'todos', todo.id);

  const toggleComplete = async () => {
    try {
      await updateDoc(todoRef, {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error('Error updating todo: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(todoRef);
    } catch (error) {
      console.error('Error deleting todo: ', error);
    }
  };

  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
      />
      <span
        className={`flex-grow mx-4 text-gray-800 dark:text-gray-200 transition-colors duration-300 ${
          todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
        aria-label="Delete todo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;
