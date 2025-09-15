import { useState, useCallback } from 'react';

const TodoForm = ({ onAdd }: { onAdd: (text: string) => void }) => {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input.trim()) {
        onAdd(input.trim());
        setInput(''); // Reset input after adding
      }
    },
    [input, onAdd]
  );

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new todo"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default TodoForm;
