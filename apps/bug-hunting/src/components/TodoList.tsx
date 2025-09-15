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
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
