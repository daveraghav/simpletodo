
import React, { useState, useEffect, useCallback } from 'react';
import { User, signOut } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { auth, firestore } from '../services/firebase';
import { Todo } from '../types';
import TodoItem from './TodoItem';
import { Button } from './Button';
import { Input } from './Input';
import { Spinner } from './Spinner';

interface TodoListScreenProps {
  user: User;
}

const TodoListScreen: React.FC<TodoListScreenProps> = ({ user }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    try {
      await addDoc(collection(firestore, 'todos'), {
        text: newTodo.trim(),
        completed: false,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      setNewTodo('');
    } catch (err) {
      console.error('Error adding todo: ', err);
      setError('Failed to add todo. Please try again.');
    }
  };

  useEffect(() => {
    const todosCollection = collection(firestore, 'todos');
    const q = query(
      todosCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const todosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];
        setTodos(todosData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching todos: ', err);
        setError('Failed to load todos.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user.uid]);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Todos</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
        </div>
        <Button onClick={handleLogout} variant="secondary">
          Logout
        </Button>
      </header>

      <main>
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-grow"
          />
          <Button type="submit">Add Todo</Button>
        </form>

        {loading ? (
          <div className="text-center p-8">
            <Spinner />
          </div>
        ) : error ? (
           <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            {todos.length > 0 ? (
              todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
            ) : (
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">No todos yet. Add one above!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TodoListScreen;
