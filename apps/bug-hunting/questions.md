# Bug Hunting Challenge - Questions

Please answer the following questions about the bugs you identified and fixed:

---

1. **Bug Overview**: List the bugs you found and fixed. For each bug, briefly describe:
   - What was the issue?
   - How did you identify it?
   - How did you fix it?

### State Mutation Bugs

**Bug 1: Direct Array Mutation in addTodo**

- **Issue**: The `addTodo` function was directly mutating the state array using `todos.push()`, which React doesn't detect, preventing re-renders
- **Identification**: Noticed that todos could be added (console logs showed them) but weren't appearing in the UI
- **Fix**: Replaced direct mutation with spread operator: `setTodos((prevTodos) => [...prevTodos, newTodo])`

**Bug 2: Direct Object Mutation in toggleTodo**

- **Issue**: The `toggleTodo` function was directly mutating todo objects with `todo.completed = !todo.completed`
- **Identification**: Checkbox state wasn't updating visually when clicked
- **Fix**: Created new objects using spread operator: `{ ...todo, completed: !todo.completed }`

### React Best Practices Violations

**Bug 3: Missing Key Prop in TodoList**

- **Issue**: The map function in TodoList was missing the `key` prop, causing React performance issues
- **Identification**: React warnings in console and potential rendering issues
- **Fix**: Added `key={todo.id}` to each `<li>` element

**Bug 4: Loose Equality Comparison**

- **Issue**: Using `==` instead of `===` for ID comparison in toggleTodo function
- **Identification**: Code review and TypeScript strict mode
- **Fix**: Changed to strict equality: `todo.id === id`

### User Experience Issues

**Bug 5: Input Field Not Resetting**

- **Issue**: After adding a todo, the input field remained filled instead of clearing
- **Identification**: Manual testing of the form submission
- **Fix**: Added `setInput('')` after successful todo addition

**Bug 6: Missing Input Validation**

- **Issue**: Users could add empty todos with just whitespace characters
- **Identification**: Manual testing revealed empty todos could be created
- **Fix**: Added validation: `if (input.trim())` before adding todos

### Performance and Optimization Issues

**Bug 7: Function Call Instead of Memoized Value**

- **Issue**: `filteredTodos()` was called as a function instead of using the memoized value
- **Identification**: Code review and understanding of React
- **Fix**: Changed from `todos={filteredTodos()}` to `todos={filteredTodos}`

**Bug 8: Incorrect useCallback Dependencies**

- **Issue**: `addTodo` had `todos` in dependency array, causing unnecessary re-creations
- **Identification**: Performance optimization review
- **Fix**: Removed unnecessary dependency and used functional state updates

---

2. **Technical Approach**: What debugging tools and techniques did you use to identify and fix the bugs?

Initially just starting the application in dev mode and looking at the browser console. This gives an indication where to look first. In the case of this project, ESLint and TS where very helpful to identify issues within the code. Once the app was rendering correctly, console logs and manual testing were enough to get to a fully functional application. Knowledge and unstranding of React made it easy to notice issues simply by reading the code.

---

3. **Code Improvements**: Beyond fixing bugs, did you make any improvements to the code organization or structure? If so, what and why?

Yes, several significant improvements were made to enhance code organization, performance, and maintainability:

### Performance Optimizations

**React Hooks Optimization**

- **useMemo for filteredTodos**: Replaced the `filteredTodos()` function with `useMemo` to prevent unnecessary recalculations on every render
- **useCallback for all event handlers**: Wrapped `addTodo`, `toggleTodo`, `deleteTodo`, and `clearCompleted` in `useCallback` to prevent unnecessary re-renders of child components
- **Functional state updates**: Used functional updates (`prevTodos => ...`) instead of depending on current state, reducing dependencies and improving performance

**Component Memoization**

- **Created TodoItem component**: Extracted individual todo items into a separate `memo`-wrapped component to prevent re-rendering of unchanged items
- **Optimized re-render behavior**: Now when one todo is toggled, other todos don't re-render unnecessarily

### Code Organization Improvements

**Component Separation**

- **TodoItem.tsx**: Created a dedicated component for individual todo items with proper TypeScript interfaces
- **Better separation of concerns**: Each component now has a single responsibility

**TypeScript Enhancements**

- **Explicit prop interfaces**: Added proper TypeScript interfaces for all component props
- **Better type safety**: Improved type definitions and removed any implicit `any` types
- **Strict equality**: Replaced loose equality (`==`) with strict equality (`===`)

### Developer Experience Improvements

**Code Formatting and Consistency**

- **Prettier configuration**: Set up consistent code formatting with `.prettierrc` and `.prettierignore`
- **VS Code settings**: Configured format-on-save and ESLint auto-fix
- **Consistent code style**: Applied consistent formatting across all files

**Code Quality**

- **Better function organization**: Improved readability with proper formatting and structure
- **Consistent naming**: Ensured consistent naming conventions throughout

### Why These Improvements Matter

1. **Performance**: The app now scales better with larger todo lists and has fewer unnecessary re-renders
2. **Maintainability**: Separated components make the code easier to understand and modify
3. **Developer Experience**: Consistent formatting and better tooling make development more efficient
4. **Type Safety**: Better TypeScript usage prevents runtime errors and improves IDE support
5. **Future-Proofing**: The structure makes it easier to add new features like search, categories, or persistence

---

4. **Future Prevention**: How would you prevent similar bugs in future development? Consider both coding practices and testing strategies.

### Coding Practices and Standards

- **Always utilise types**: Use proper type definitions for all props and state
- **Never use `any`**: Avoid `any` types and use proper type assertions
- **Always use functional updates**: Use `setState(prevState => ...)` instead of depending on current state
- **Never mutate state directly**: Always create new objects/arrays using spread operator or immutable libraries
- **Use TypeScript strict mode**: Enable strict TypeScript settings to catch type-related issues early
- **Consistent equality checks**: Always use `===` instead of `==` for comparisons
- **ESLint with React rules**: Configure ESLint to catch common React anti-patterns and pay attention to feedback
- **Pre-commit hooks**: Use tools like Husky to run linting and formatting before commits
- **Coding standards**: Document team coding standards and best practices
- **React guidelines**: Create internal documentation for React-specific patterns

Obviously testing needs to be mentioned but that is a much deeper topic. Unit test, intergration and E2E tests all serve to prevent bugs and aid in development.

---

5. **Learning**: What was the most challenging or interesting aspect of this bug-hunting exercise?

Overall none of the issues were particularly difficult to address, the challenge was getting the application running to start the functional bug hunting. The initial state of the code was such that there were compounding issue that prevent an initial load so it was a matter of fixing some obvious issues and commenting out some code to get that initial load and begin swatting.
