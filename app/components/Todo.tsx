"use client";

import { useState } from 'react';
import { Plus, Check, Trash } from 'lucide-react';
import Image from 'next/image';

type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: {
    name: string;
    avatar: string;
  };
};

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      text: 'Update profile design',
      completed: false,
      priority: 'high',
      assignedTo: {
        name: 'Bogdan Nikitin',
        avatar: 'https://avatars.githubusercontent.com/u/59017652?v=4',
      },
    },
    {
      id: '2',
      text: 'Create new post feature',
      completed: true,
      priority: 'medium',
    },
    {
      id: '3',
      text: 'Research competitor apps',
      completed: false,
      priority: 'low',
    },
  ]);
  
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          priority: newPriority,
        },
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>
      
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        
        <select
          className="border border-gray-200 rounded-lg p-2 focus:outline-none cursor-pointer"
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <button
          onClick={addTodo}
          className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 focus:outline-none cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`p-3 border-l-4 ${
              todo.completed ? 'border-gray-300 bg-gray-50' : `border-${todo.priority === 'high' ? 'red' : todo.priority === 'medium' ? 'yellow' : 'green'}-500 bg-white`
            } rounded-lg flex items-center justify-between`}
          >
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ${
                  todo.completed ? 'bg-green-500' : 'border border-gray-300'
                }`}
              >
                {todo.completed && <Check size={12} color="white" />}
              </button>
              
              <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                {todo.text}
              </span>
              
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                {todo.priority}
              </span>
            </div>
            
            {todo.assignedTo && (
              <div className="flex items-center mx-2">
                <div className="relative group cursor-pointer">
                  <Image
                    src={todo.assignedTo.avatar}
                    alt={todo.assignedTo.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {todo.assignedTo.name}
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        {todos.filter(t => t.completed).length} of {todos.length} tasks completed
      </div>
    </div>
  );
} 