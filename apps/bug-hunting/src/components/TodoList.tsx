import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

const TodoList = ({
todos,
onToggle,
  onDelete,
}: {
  todos: Todo[];
  onToggle: (todo: string) => void;
onDelete: (id: string) => void;
}) => {
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          <input 
            type="checkbox" 
            checked={todo.complete} 
            onChange={() => onToggle(todo)}
          />
          <span>{todo.text}</span>
          <button 
            className="delete-btn"
            onClick={onDelete(todo.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TodoList 